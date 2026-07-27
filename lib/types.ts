export type OrderStatus = 'pending' | 'ready' | 'cancelled';

export interface Order {
  id: number;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  order_text: string | null;
  photo_path: string | null;
  note: string | null;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
  /** Total number of orders ever placed by this customer (returned by GET /api/orders) */
  total_count?: number;
}

export interface CreateOrderInput {
  customer_name: string;
  customer_phone: string;
  customer_email?: string | null;
  order_text?: string | null;
  photo_path?: string | null;
  note?: string | null;
}
