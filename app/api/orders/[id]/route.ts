import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { config } from '@/lib/config';

export const runtime = 'nodejs';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const id = Number(params.id);
    if (!Number.isFinite(id)) {
      return NextResponse.json({ error: 'Invalid order id' }, { status: 400 });
    }

    const body = await req.json();
    const status = body.status;

    if (!['ready', 'cancelled'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', id)
      .select('id, status')
      .single();

    if (error) {
      console.error(error);
      return NextResponse.json(
        { error: error.message || 'Failed to update order' },
        { status: 500 },
      );
    }

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Internal server error' },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const id = Number(params.id);
    if (!Number.isFinite(id)) {
      return NextResponse.json({ error: 'Invalid order id' }, { status: 400 });
    }

    // Fetch photo_path before deleting
    const { data: order } = await supabase
      .from('orders')
      .select('photo_path')
      .eq('id', id)
      .maybeSingle();

    // Delete photo from storage if it exists
    if (order?.photo_path) {
      await supabase.storage
        .from(config.storageBucket)
        .remove([order.photo_path]);
    }

    // Delete row
    const { error } = await supabase.from('orders').delete().eq('id', id);

    if (error) {
      return NextResponse.json({ error: 'Failed to delete order' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Internal server error' },
      { status: 500 },
    );
  }
}
