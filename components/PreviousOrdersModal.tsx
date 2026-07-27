'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { StatusBadge } from '@/components/StatusBadge';
import { ConfirmDialog } from '@/components/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { History, Loader2, Camera, Trash2, Inbox } from 'lucide-react';
import { formatPhone } from '@/lib/phone';
import type { Order } from '@/lib/types';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';

interface PreviousOrdersModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  phone: string;
  currentOrderId?: number;
  count: number;
  /** Called after a delete so the parent dashboard can refresh its data. */
  onOrderDeleted?: (id: number) => void;
}

/* ─── Formatted date helper ──────────────────────────────────────────── */

function FormattedDate({ iso }: { iso: string }) {
  const d = new Date(iso);
  return (
    <div className="text-xs text-brown-500 leading-tight">
      <span>{format(d, 'd MMM yyyy')}</span>
      <br />
      <span>{format(d, 'h:mm a')}</span>
    </div>
  );
}

/* ─── Single order card inside the modal ─────────────────────────────── */

function HistoryCard({
  order,
  isCurrent,
  photoLoadingId,
  deletingId,
  onViewPhoto,
  onDelete,
}: {
  order: Order;
  isCurrent: boolean;
  photoLoadingId: number | null;
  deletingId: number | null;
  onViewPhoto: (id: number) => void;
  onDelete: (id: number) => Promise<void>;
}) {
  return (
    <div
      className={`rounded-xl border bg-white p-4 sm:p-5 ${
        isCurrent
          ? 'border-forest-500 ring-1 ring-forest-100'
          : 'border-beige-300'
      }`}
    >
      {/* Top row: order id + badge + date */}
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-heading text-sm font-bold text-forest-700">
            Order #{order.id}
          </span>
          {isCurrent && (
            <span className="rounded-full bg-forest-50 px-2 py-0.5 text-[10px] font-bold text-forest-700">
              THIS ORDER
            </span>
          )}
          <StatusBadge status={order.status} />
        </div>
        <FormattedDate iso={order.created_at} />
      </div>

      {/* Order text */}
      {order.order_text && (
        <p className="mt-3 whitespace-pre-wrap break-words rounded-lg bg-beige-100 px-3 py-2.5 text-sm text-brown-900">
          {order.order_text}
        </p>
      )}

      {/* Note */}
      {order.note && (
        <p className="mt-2 break-words text-sm italic text-brown-600">
          📝 {order.note}
        </p>
      )}

      {/* Action buttons */}
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {order.photo_path && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 px-2.5 text-xs font-semibold text-forest-700 hover:bg-forest-50"
            onClick={() => onViewPhoto(order.id)}
            disabled={photoLoadingId === order.id}
          >
            {photoLoadingId === order.id ? (
              <Loader2 className="mr-1 h-3 w-3 animate-spin" />
            ) : (
              <Camera className="mr-1 h-3 w-3" />
            )}
            📷 View Photo
          </Button>
        )}

        <ConfirmDialog
          trigger={
            <Button
              variant="ghost"
              size="sm"
              disabled={deletingId === order.id}
              className="h-8 px-2.5 text-xs font-semibold text-destructive hover:bg-destructive/5 hover:text-destructive"
            >
              {deletingId === order.id ? (
                <Loader2 className="mr-1 h-3 w-3 animate-spin" />
              ) : (
                <Trash2 className="mr-1 h-3 w-3" />
              )}
              Delete
            </Button>
          }
          title={`Delete Order #${order.id}?`}
          description="This will permanently delete this order and its photo. This cannot be undone."
          confirmLabel="Delete"
          onConfirm={() => onDelete(order.id)}
        />
      </div>
    </div>
  );
}

/* ─── Main modal component ───────────────────────────────────────────── */

export function PreviousOrdersModal({
  open,
  onOpenChange,
  phone,
  currentOrderId,
  count,
  onOrderDeleted,
}: PreviousOrdersModalProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [photoLoadingId, setPhotoLoadingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const { toast } = useToast();

  const fetchHistory = useCallback(async () => {
    if (!phone) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/orders/history?phone=${encodeURIComponent(phone)}`,
      );
      if (!res.ok) throw new Error('Failed to load history');
      const data: Order[] = await res.json();
      // API already returns newest-first, but enforce it client-side too
      data.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      );
      setOrders(data);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [phone]);

  useEffect(() => {
    if (open) fetchHistory();
  }, [open, fetchHistory]);

  const viewPhoto = async (orderId: number) => {
    setPhotoLoadingId(orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}/sign`);
      if (!res.ok) throw new Error('Failed to get signed URL');
      const { signedUrl } = await res.json();
      if (signedUrl) window.open(signedUrl, '_blank', 'noopener,noreferrer');
    } catch {
      toast({
        title: 'Could not load photo. Try again.',
        variant: 'destructive',
      });
    } finally {
      setPhotoLoadingId(null);
    }
  };

  const deleteOrder = async (id: number) => {
    setDeletingId(id);
    try {
      const res = await fetch(`/api/orders/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      // Remove from local state
      setOrders((prev) => prev.filter((o) => o.id !== id));
      toast({ title: `Order #${id} deleted` });
      // Notify parent to refresh dashboard
      onOrderDeleted?.(id);
    } catch {
      toast({
        title: 'Delete failed',
        description: 'Please try again.',
        variant: 'destructive',
      });
    } finally {
      setDeletingId(null);
    }
  };

  /* ─── Shared inner content ──────────────────────────────────── */

  const renderContent = () => (
    <div className="space-y-3">
      {/* Loading skeletons */}
      {loading && (
        <>
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-xl border border-beige-300 bg-white p-4"
            >
              <Skeleton className="mb-2 h-4 w-24" />
              <Skeleton className="mb-1 h-3 w-full" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          ))}
        </>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && orders.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-3 py-14 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-beige-200">
            <Inbox className="h-6 w-6 text-brown-400" />
          </div>
          <p className="text-base font-semibold text-brown-800">
            No previous orders
          </p>
          <p className="max-w-xs text-sm text-brown-500">
            When this customer places orders, they'll appear here.
          </p>
        </div>
      )}

      {/* Order cards */}
      {!loading && !error && orders.length > 0 && (
        <div className="space-y-3">
          {orders.map((o) => (
            <HistoryCard
              key={o.id}
              order={o}
              isCurrent={o.id === currentOrderId}
              photoLoadingId={photoLoadingId}
              deletingId={deletingId}
              onViewPhoto={viewPhoto}
              onDelete={deleteOrder}
            />
          ))}
        </div>
      )}
    </div>
  );

  const displayCount = loading ? count : orders.length;

  /* ─── Header (shared between Dialog / Sheet) ────────────────── */

  const headerContent = (
    TitleComponent: typeof DialogTitle | typeof SheetTitle,
    DescComponent: typeof DialogDescription | typeof SheetDescription,
  ) => (
    <div className="flex items-center gap-2">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-forest-50">
        <History className="h-4 w-4 text-forest-700" />
      </div>
      <div className="min-w-0">
        <TitleComponent className="font-heading text-base font-bold text-brown-900">
          Previous Orders ({displayCount})
        </TitleComponent>
        <DescComponent className="truncate text-sm text-brown-500">
          {formatPhone(phone)}
        </DescComponent>
      </div>
    </div>
  );

  return (
    <>
      {/* ── Desktop / Tablet: Centered Dialog ─────────────────── */}
      <div className="hidden sm:block">
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent className="flex max-h-[80vh] w-[90vw] max-w-[900px] flex-col border-beige-300 p-0 relative">
            {/* Sticky header */}
            <DialogHeader className="sticky top-0 z-10 border-b border-beige-200 bg-white px-6 py-4 rounded-t-lg">
              {headerContent(DialogTitle, DialogDescription)}
            </DialogHeader>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto scroll-smooth px-6 py-4">
              {renderContent()}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* ── Mobile: Full-height Bottom Sheet ──────────────────── */}
      <div className="sm:hidden">
        <Sheet open={open} onOpenChange={onOpenChange}>
          <SheetContent
            side="bottom"
            className="flex max-h-[95vh] flex-col border-beige-300 p-0"
          >
            {/* Sticky header */}
            <SheetHeader className="sticky top-0 z-10 border-b border-beige-200 bg-white px-4 py-4">
              {headerContent(SheetTitle, SheetDescription)}
            </SheetHeader>

            {/* Scrollable body */}
            <div className="flex-1 overflow-y-auto scroll-smooth px-4 py-4">
              {renderContent()}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
