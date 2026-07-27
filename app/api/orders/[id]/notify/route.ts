import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { sendOrderReadyEmail } from '@/lib/mailer';

export const runtime = 'nodejs';

export async function POST(
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
      .select('customer_name, customer_email')
      .eq('id', id)
      .maybeSingle();

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (!order.customer_email) {
      return NextResponse.json({ ok: false, error: 'No email on file' }, { status: 400 });
    }

    try {
      await sendOrderReadyEmail({
        customerEmail: order.customer_email,
        orderId: id,
      });
    } catch (emailErr: any) {
      return NextResponse.json(
        { error: emailErr?.message || 'Failed to send ready email' },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Internal server error' },
      { status: 500 },
    );
  }
}
