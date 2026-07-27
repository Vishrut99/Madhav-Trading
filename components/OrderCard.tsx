'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import {
  Phone,
  Mail,
  StickyNote,
  Camera,
  History,
  CheckCircle2,
  Archive,
  Trash2,
  Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/StatusBadge';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { PreviousOrdersModal } from '@/components/PreviousOrdersModal';
import { formatPhone } from '@/lib/phone';
import type { Order } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

interface OrderCardProps {
  order: Order;
  previousCount: number;
  onStatusChange: (id: number, status: Order['status']) => void;
  onDelete: (id: number) => void;
}

export function OrderCard({
  order,
  previousCount,
  onStatusChange,
  onDelete,
}: OrderCardProps) {
  /** Called when an order is deleted from inside the PreviousOrdersModal */
  const handleModalDelete = (deletedId: number) => {
    onDelete(deletedId);
  };
  const [busy, setBusy] = useState(false);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const { toast } = useToast();

  const patch = async (status: Order['status']) => {
    setBusy(true);
    try {
      const res = await fetch(`/api/orders/${order.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        console.error('[PATCH order] error response:', errBody);
        throw new Error(errBody?.error || 'Failed to update');
      }
      onStatusChange(order.id, status);

      if (status === 'ready' && order.customer_email) {
        fetch(`/api/orders/${order.id}/notify`, { method: 'POST' }).catch(() => {});
        toast({
          title: 'Marked as ready',
          description: `Email sent to ${order.customer_email}`,
        });
      } else {
        toast({ title: `Order #${order.id} moved to ${status}` });
      }
    } catch (err: any) {
      console.error('[PATCH order] caught error:', err);
      toast({
        title: 'Update failed',
        description: err?.message || 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    setBusy(true);
    try {
      const res = await fetch(`/api/orders/${order.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      onDelete(order.id);
      toast({ title: `Order #${order.id} deleted` });
    } catch {
      toast({
        title: 'Delete failed',
        description: 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setBusy(false);
    }
  };

  const viewPhoto = async () => {
    setPhotoLoading(true);
    try {
      const res = await fetch(`/api/orders/${order.id}/sign`);
      if (!res.ok) throw new Error('Failed to get photo');
      const { signedUrl } = await res.json();
      if (signedUrl) window.open(signedUrl, '_blank', 'noopener,noreferrer');
    } catch {
      toast({
        title: 'Could not load photo. Try again.',
        variant: 'destructive',
      });
    } finally {
      setPhotoLoading(false);
    }
  };

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, height: 0, marginBottom: 0, transition: { duration: 0.25 } }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden rounded-2xl border border-beige-300 bg-white shadow-warm"
      >
        {/* Top row */}
        <div className="flex items-center justify-between gap-2 border-b border-beige-300 bg-beige-100 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-forest-50 px-2.5 py-0.5 text-xs font-bold text-forest-700">
              Order #{order.id}
            </span>
            <StatusBadge status={order.status} />
          </div>
          <span className="text-xs font-medium text-brown-500">
            {formatDistanceToNow(new Date(order.created_at), { addSuffix: true })}
          </span>
        </div>

        {/* Body */}
        <div className="space-y-3 px-4 py-4">
          {/* Customer */}
          <div>
            <p className="font-heading text-base font-bold text-brown-900">
              {order.customer_name}
            </p>
            <a
              href={`tel:${order.customer_phone}`}
              className="mt-0.5 inline-flex items-center gap-1.5 text-sm font-semibold text-forest-700 hover:text-forest-800"
            >
              <Phone className="h-3.5 w-3.5" />
              {formatPhone(order.customer_phone)}
            </a>
            {order.customer_email && (
              <a
                href={`mailto:${order.customer_email}`}
                className="mt-0.5 flex items-center gap-1.5 text-sm text-brown-700 hover:text-forest-700"
              >
                <Mail className="h-3.5 w-3.5" />
                {order.customer_email}
              </a>
            )}
          </div>

          {/* Order text */}
          {order.order_text && (
            <div className="rounded-lg border-l-4 border-gold-500 bg-beige-100 px-3.5 py-2.5">
              <p className="whitespace-pre-wrap text-sm text-brown-900">
                {order.order_text}
              </p>
            </div>
          )}

          {/* Photo — button only, no inline image */}
          {order.photo_path && (
            <Button
              variant="outline"
              size="sm"
              onClick={viewPhoto}
              disabled={photoLoading}
              className="h-9 border-forest-200 text-forest-700 hover:bg-forest-50"
            >
              {photoLoading ? (
                <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
              ) : (
                <Camera className="mr-1.5 h-3.5 w-3.5" />
              )}
              📷 View Photo
            </Button>
          )}

          {/* Note */}
          {order.note && (
            <div className="flex items-start gap-1.5 text-sm text-brown-700">
              <StickyNote className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-600" />
              <span className="italic">{order.note}</span>
            </div>
          )}

          {/* Previous orders — show count excluding the current order */}
          {previousCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setHistoryOpen(true)}
              className="h-8 px-2 text-sm font-semibold text-gold-600 hover:text-gold-500"
            >
              <History className="mr-1.5 h-3.5 w-3.5" />
              Previous Orders ({previousCount})
            </Button>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-2 pt-1">
            {order.status === 'pending' && (
              <>
                <Button
                  size="sm"
                  onClick={() => patch('ready')}
                  disabled={busy}
                  className="bg-forest-600 text-white hover:bg-forest-700"
                >
                  {busy ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />}
                  Mark Ready
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => patch('cancelled')}
                  disabled={busy}
                  className="border-brown-300 text-brown-700 hover:bg-beige-100"
                >
                  <Archive className="mr-1.5 h-3.5 w-3.5" />
                  Archive
                </Button>
              </>
            )}
            <ConfirmDialog
              trigger={
                <Button size="sm" variant="outline" disabled={busy} className="border-destructive/30 text-destructive hover:bg-destructive/5 hover:text-destructive">
                  <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                  Delete
                </Button>
              }
              title={`Delete Order #${order.id}?`}
              description={`This will permanently delete Order #${order.id} and its photo. This cannot be undone.`}
              confirmLabel="Delete"
              onConfirm={remove}
            />
          </div>
        </div>
      </motion.div>

      <PreviousOrdersModal
        open={historyOpen}
        onOpenChange={setHistoryOpen}
        phone={order.customer_phone}
        currentOrderId={order.id}
        count={previousCount}
        onOrderDeleted={handleModalDelete}
      />
    </>
  );
}
