import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { normalizePhone } from '@/lib/phone';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const phoneRaw = searchParams.get('phone');

    if (!phoneRaw) {
      return NextResponse.json({ error: 'Phone parameter required' }, { status: 400 });
    }

    const phone = normalizePhone(phoneRaw);
    if (phone.length !== 10) {
      return NextResponse.json({ error: 'Invalid phone' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('customer_phone', phone)
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: 'Failed to fetch history' }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Internal server error' },
      { status: 500 },
    );
  }
}
