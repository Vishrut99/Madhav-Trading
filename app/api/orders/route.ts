import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { sendNewOrderEmail } from '@/lib/mailer';
import { normalizePhone, validateIndianPhone } from '@/lib/phone';
import { config } from '@/lib/config';

export const runtime = 'nodejs';

function getExtension(file: File): string {
  const type = file.type;
  if (type === 'image/png') return 'png';
  if (type === 'image/webp') return 'webp';
  return 'jpg';
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const customer_name = (formData.get('customer_name') as string)?.trim();
    const customer_phone_raw = (formData.get('customer_phone') as string)?.trim();
    const customer_email = (formData.get('customer_email') as string)?.trim() || null;
    const order_text = (formData.get('order_text') as string)?.trim() || null;
    const note = (formData.get('note') as string)?.trim() || null;
    const photo = formData.get('photo') as File | null;

    // Validation
    if (!customer_name || customer_name.length < 2) {
      return NextResponse.json({ error: 'Please enter your name' }, { status: 400 });
    }

    const customer_phone = normalizePhone(customer_phone_raw);
    if (!validateIndianPhone(customer_phone)) {
      return NextResponse.json(
        { error: 'Please enter a valid 10-digit Indian phone number' },
        { status: 400 },
      );
    }

    if (customer_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer_email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    if (!order_text && !photo) {
      return NextResponse.json(
        { error: 'Please provide order details or a photo' },
        { status: 400 },
      );
    }

    if (photo && photo.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Photo must be under 5MB' }, { status: 400 });
    }

    // Step 1: Insert order (without photo) to get id
    const { data: inserted, error: insertError } = await supabase
      .from('orders')
      .insert({
        customer_name,
        customer_phone,
        customer_email,
        order_text,
        note,
        photo_path: null,
        status: 'pending',
      })
      .select('id')
      .single();

    if (insertError || !inserted) {
      return NextResponse.json(
        { error: 'Failed to create order' },
        { status: 500 },
      );
    }

    const orderId = inserted.id;
    let photoPath: string | null = null;

    // Step 2: Upload photo if provided
    if (photo && photo.size > 0) {
      const now = new Date();
      const year  = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day   = String(now.getDate()).padStart(2, '0');
      const uuid  = crypto.randomUUID();
      const ext   = photo.type.split('/')[1] || 'jpg';
      photoPath = `orders/${year}/${month}/${day}/order-${orderId}-${uuid}.${ext}`;

      // Convert File → Buffer so Supabase Storage receives a proper binary payload
      const arrayBuffer = await photo.arrayBuffer();
      const photoBuffer = Buffer.from(arrayBuffer);

      // Ensure the bucket exists — create it (private) if missing
      const { error: bucketErr } = await supabase.storage.createBucket(config.storageBucket, {
        public: false,
        allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
        fileSizeLimit: 10485760, // 10 MB
      });
      // Ignore "already exists" error (23505 / Duplicate), fail on anything else
      if (bucketErr && !bucketErr.message.toLowerCase().includes('already exist')) {
        console.error('[PHOTO UPLOAD] bucket create error:', JSON.stringify(bucketErr, null, 2));
      }

      console.log('[PHOTO UPLOAD] file.type:', photo.type, '| file.size:', photo.size, '| buffer.length:', photoBuffer.length, '| path:', photoPath);

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(config.storageBucket)
        .upload(photoPath, photoBuffer, {
          contentType: photo.type,
          upsert: false,
        });

      if (uploadError) {
        console.error('PHOTO UPLOAD FAILED:', JSON.stringify(uploadError, null, 2));
        // Continue without photo — order is still valid
        photoPath = null;
      } else {
        console.log('[PHOTO UPLOAD] success, uploadData:', uploadData);
        // Step 3: Update row with photo_path
        const { error: updateError } = await supabase
          .from('orders')
          .update({ photo_path: photoPath })
          .eq('id', orderId);

        if (updateError) {
          console.error('PHOTO PATH UPDATE FAILED:', JSON.stringify(updateError, null, 2));
        } else {
          console.log('[PHOTO UPLOAD] photo_path saved to DB for order', orderId);
        }
      }
    }




    try {
      await sendNewOrderEmail({
        customerName: customer_name,
        customerPhone: customer_phone,
        orderText: order_text,
        note,
        photoPath,
        orderId,
      });
    } catch (emailErr: any) {
      console.error('[EMAIL ERROR] Failed to send new order email:');
      console.error('  message    :', emailErr?.message);
      console.error('  code       :', emailErr?.code);
      console.error('  responseCode:', emailErr?.responseCode);
      console.error('  response   :', emailErr?.response);
      console.error('  stack      :', emailErr?.stack?.split('\n').slice(0, 4).join('\n'));
    }

    return NextResponse.json({ orderId });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Internal server error' },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');

    let query = supabase.from('orders').select('*');
    if (status && ['pending', 'ready', 'cancelled'].includes(status)) {
      query = query.eq('status', status);
    }
    query = query.order('created_at', { ascending: false });

    const { data, error } = await query;

    if (error) {
      console.error('[GET /api/orders] Supabase error:', error);
      return NextResponse.json({ error: error.message || 'Failed to fetch orders' }, { status: 500 });
    }

    let orders = data || [];

    // For pending and ready: deduplicate — keep only the latest order per phone number.
    if (status === 'pending' || status === 'ready') {
      const latestByPhone = new Map<string, (typeof orders)[number]>();
      for (const order of orders) {
        if (!latestByPhone.has(order.customer_phone)) {
          latestByPhone.set(order.customer_phone, order);
        }
      }
      orders = Array.from(latestByPhone.values());
    }

    // Attach total_count: total number of orders ever placed by that phone number
    // across all statuses. This lets the frontend compute previousCount = total_count - 1.
    const uniquePhones = [...new Set(orders.map((o) => o.customer_phone))];
    const phoneTotalMap: Record<string, number> = {};
    if (uniquePhones.length > 0) {
      const { data: countData } = await supabase
        .from('orders')
        .select('customer_phone')
        .in('customer_phone', uniquePhones);
      if (countData) {
        for (const row of countData) {
          phoneTotalMap[row.customer_phone] = (phoneTotalMap[row.customer_phone] || 0) + 1;
        }
      }
    }

    const enriched = orders.map((o) => ({
      ...o,
      total_count: phoneTotalMap[o.customer_phone] ?? 1,
    }));

    return NextResponse.json(enriched);
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Internal server error' },
      { status: 500 },
    );
  }
}

