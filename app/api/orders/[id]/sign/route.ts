import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { config } from '@/lib/config';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const id = Number(params.id);
    if (!Number.isFinite(id)) {
      return NextResponse.json({ error: 'Invalid order id' }, { status: 400 });
    }

    const { data: order } = await supabase
      .from('orders')
      .select('photo_path')
      .eq('id', id)
      .maybeSingle();

    if (!order?.photo_path) {
      return NextResponse.json({ error: 'No photo for this order' }, { status: 404 });
    }

    const { data, error } = await supabase.storage
      .from(config.storageBucket)
      .createSignedUrl(order.photo_path, 3600); // 1 hour expiry

    if (error || !data?.signedUrl) {
      return NextResponse.json({ error: 'Failed to generate signed URL' }, { status: 500 });
    }

    return NextResponse.json({ signedUrl: data.signedUrl });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Internal server error' },
      { status: 500 },
    );
  }
}
