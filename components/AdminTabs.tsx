'use client';

import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, RefreshCw, Inbox, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OrderCard } from '@/components/OrderCard';
import type { Order, OrderStatus } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

const TABS: { key: OrderStatus; label: string }[] = [
  { key: 'pending', label: 'Pending' },
  { key: 'ready', label: 'Ready' },
  { key: 'cancelled', label: 'Cancelled' },
];

export function AdminTabs() {
  const [active, setActive] = useState<OrderStatus>('pending');
  const [orders, setOrders] = useState<Order[]>([]);
  const [counts, setCounts] = useState<Record<OrderStatus, number>>({
    pending: 0,
    ready: 0,
    cancelled: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState('');
  const { toast } = useToast();

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      // Single call: returns all orders (all statuses) with total_count per order.
      // The server-side deduplication only applies when ?status= is passed;
      // we handle it client-side below.
      const res = await fetch('/api/orders');
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        console.error('[AdminTabs] fetch failed:', res.status, errBody);
        throw new Error(errBody?.error || `Failed to load orders (${res.status})`);
      }
      const data: Order[] = await res.json();

      setOrders(data);
      // Derive counts from raw data
      setCounts({
        pending: countUnique(data, 'pending'),
        ready: countUnique(data, 'ready'),
        cancelled: data.filter((o) => o.status === 'cancelled').length,
      });
    } catch (err: any) {
      console.error('[AdminTabs] fetchOrders error:', err);
      setError(true);
      toast({
        title: 'Could not load orders',
        description: err?.message || 'Please check the console and try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  /** Count unique phones for pending/ready (mirrors server deduplication). */
  function countUnique(data: Order[], status: OrderStatus): number {
    const phones = new Set<string>();
    for (const o of data) {
      if (o.status === status) phones.add(o.customer_phone);
    }
    return phones.size;
  }




  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);



  const handleStatusChange = (id: number, status: OrderStatus) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    setCounts((prev) => {
      const next = { ...prev };
      const old = orders.find((o) => o.id === id)?.status;
      if (old) next[old] = Math.max(0, next[old] - 1);
      next[status] = next[status] + 1;
      return next;
    });
  };

  const handleDelete = (id: number) => {
    setOrders((prev) => {
      const removed = prev.find((o) => o.id === id);
      if (removed) {
        setCounts((c) => ({ ...c, [removed.status]: Math.max(0, c[removed.status] - 1) }));
      }
      return prev.filter((o) => o.id !== id);
    });
  };

  const filtered = (() => {
    let list = orders
      .filter((o) => o.status === active)
      .filter((o) => {
        if (!search.trim() || active !== 'cancelled') return true;
        const q = search.toLowerCase();
        return (
          o.customer_name.toLowerCase().includes(q) ||
          o.customer_phone.includes(q.replace(/\D/g, ''))
        );
      })
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    // For pending/ready: show only the most recent order per phone number.
    if (active === 'pending' || active === 'ready') {
      const seen = new Set<string>();
      list = list.filter((o) => {
        if (seen.has(o.customer_phone)) return false;
        seen.add(o.customer_phone);
        return true;
      });
    }

    return list;
  })();


  return (
    <div className="space-y-5">
      <Tabs value={active} onValueChange={(v) => setActive(v as OrderStatus)}>
        <TabsList className="grid w-full grid-cols-3 bg-beige-200 shadow-warm">
          {TABS.map((t) => (
            <TabsTrigger
              key={t.key}
              value={t.key}
              className="relative text-base font-semibold data-[state=active]:bg-forest-700 data-[state=active]:text-beige-100"
            >
              {t.label}
              <span className="ml-1.5 inline-flex items-center justify-center rounded-full bg-forest-700/15 px-1.5 text-xs font-bold leading-4 text-forest-700 data-[state=active]:bg-white/20 data-[state=active]:text-beige-100">
                {counts[t.key]}
              </span>
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {active === 'cancelled' && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-brown-500" />
          <Input
            placeholder="Search by name or phone…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-11 pl-10 text-base"
          />
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-brown-500">
              <Loader2 className="h-8 w-8 animate-spin text-forest-700" />
              <p className="mt-3 text-base">Loading orders…</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center gap-4 py-20">
              <p className="text-base text-brown-700">Could not load orders.</p>
              <Button variant="outline" onClick={fetchOrders} className="border-forest-700 text-forest-800 hover:bg-forest-50">
                <RefreshCw className="mr-2 h-4 w-4" />
                Retry
              </Button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-beige-200">
                <Inbox className="h-7 w-7 text-brown-500" />
              </div>
              <p className="text-base font-semibold text-brown-900">No {active} orders</p>
              <p className="text-sm text-brown-500">
                {active === 'pending'
                  ? 'New orders will appear here.'
                  : active === 'ready'
                    ? 'Orders you mark ready will show here.'
                    : 'Cancelled orders will show here.'}
              </p>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              <AnimatePresence>
                {filtered.map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                    previousCount={Math.max(0, (order.total_count ?? 1) - 1)}
                    onStatusChange={handleStatusChange}
                    onDelete={handleDelete}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
