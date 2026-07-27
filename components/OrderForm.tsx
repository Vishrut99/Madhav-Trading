'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Loader2, CheckCircle2, ArrowRight, Home, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { PhoneInput } from '@/components/PhoneInput';
import { ImageUpload } from '@/components/ImageUpload';
import { formatPhone } from '@/lib/phone';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

const MAX_SIZE = 5 * 1024 * 1024;

const schema = z.object({
  customer_name: z
    .string()
    .min(2, 'Please enter your full name')
    .max(80, 'Name is too long'),
  customer_phone: z
    .string()
    .min(10, 'Enter a valid 10-digit phone number')
    .refine((v) => /^[6789]\d{9}$/.test(v), {
      message: 'Phone must start with 6, 7, 8, or 9 and be 10 digits',
    }),
  customer_email: z
    .string()
    .email('Enter a valid email address')
    .optional()
    .or(z.literal('')),
  order_text: z.string().optional(),
  note: z.string().max(500, 'Note is too long').optional(),
});

type FormValues = z.infer<typeof schema>;

interface SuccessState {
  orderId: number;
  phone: string;
}

export function OrderForm() {
  const [photo, setPhoto] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<SuccessState | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      customer_name: '',
      customer_phone: '',
      customer_email: '',
      order_text: '',
      note: '',
    },
  });

  const phoneValue = watch('customer_phone');
  const orderText = watch('order_text');

  const onSubmit = async (values: FormValues) => {
    setFormError(null);

    if (!values.order_text?.trim() && !photo) {
      setFormError('Please enter your order details or upload a photo of your order.');
      toast({
        title: 'Order details required',
        description: 'Add order text or a photo so we know what you need.',
        variant: 'destructive',
      });
      return;
    }

    if (photo && photo.size > MAX_SIZE) {
      toast({
        title: 'Photo too large',
        description: 'Photo must be under 5MB.',
        variant: 'destructive',
      });
      return;
    }

    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('customer_name', values.customer_name);
      formData.append('customer_phone', values.customer_phone);
      if (values.customer_email) formData.append('customer_email', values.customer_email);
      if (values.order_text) formData.append('order_text', values.order_text);
      if (values.note) formData.append('note', values.note);
      if (photo) formData.append('photo', photo);

      const res = await fetch('/api/orders', {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to submit order');
      }

      const data = await res.json();
      setSuccess({ orderId: data.orderId, phone: values.customer_phone });
    } catch (err: any) {
      toast({
        title: 'Could not submit order',
        description: err?.message || 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <SuccessView
        orderId={success.orderId}
        phone={success.phone}
        onReset={() => {
          setSuccess(null);
          setPhoto(null);
          setValue('order_text', '');
          setValue('note', '');
        }}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="customer_name" className="text-base font-semibold text-brown-900">
          Full Name <span className="text-forest-700">*</span>
        </Label>
        <Input
          id="customer_name"
          placeholder="e.g. Rajesh Patel"
          className="h-12 text-base"
          {...register('customer_name')}
        />
        {errors.customer_name && (
          <p className="text-sm font-medium text-destructive">
            {errors.customer_name.message}
          </p>
        )}
      </div>

      {/* Phone */}
      <div className="space-y-2">
        <Label htmlFor="customer_phone" className="text-base font-semibold text-brown-900">
          Phone Number <span className="text-forest-700">*</span>
        </Label>
        <PhoneInput
          value={phoneValue}
          onChange={(v) => setValue('customer_phone', v, { shouldValidate: true })}
          error={errors.customer_phone?.message}
        />
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="customer_email" className="text-base font-semibold text-brown-900">
          Email <span className="text-brown-500 font-normal">(optional)</span>
        </Label>
        <Input
          id="customer_email"
          type="email"
          placeholder="you@example.com"
          className="h-12 text-base"
          {...register('customer_email')}
        />
        {errors.customer_email && (
          <p className="text-sm font-medium text-destructive">
            {errors.customer_email.message}
          </p>
        )}
      </div>

      {/* Order text */}
      <div className="space-y-2">
        <Label htmlFor="order_text" className="text-base font-semibold text-brown-900">
          Order Details <span className="text-brown-500 font-normal">(optional if photo provided)</span>
        </Label>
        <Textarea
          id="order_text"
          rows={5}
          placeholder="Write your order items here... e.g. Chana Dal 10kg, Kaju 2kg, Haldi 1kg"
          className="resize-none text-base"
          {...register('order_text')}
        />
        <p className="text-sm text-brown-500">
          {orderText?.length || 0} characters
        </p>
        {errors.order_text && (
          <p className="text-sm font-medium text-destructive">
            {errors.order_text.message}
          </p>
        )}
      </div>

      {/* Photo upload */}
      <div className="space-y-2">
        <Label className="text-base font-semibold text-brown-900">
          Photo of Order <span className="text-brown-500 font-normal">(optional if text provided)</span>
        </Label>
        <ImageUpload file={photo} onChange={setPhoto} />
      </div>

      {/* Note */}
      <div className="space-y-2">
        <Label htmlFor="note" className="text-base font-semibold text-brown-900">
          Note to Shop <span className="text-brown-500 font-normal">(optional)</span>
        </Label>
        <Textarea
          id="note"
          rows={2}
          placeholder="Any special instructions..."
          className="resize-none text-base"
          {...register('note')}
        />
        {errors.note && (
          <p className="text-sm font-medium text-destructive">{errors.note.message}</p>
        )}
      </div>

      {/* Cross-field error */}
      {formError && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm font-medium text-destructive">
          {formError}
        </div>
      )}

      {/* Submit */}
      <Button
        type="submit"
        disabled={submitting}
        size="lg"
        className="h-14 w-full bg-gold-500 text-brown-900 text-base font-bold hover:bg-gold-400 shadow-gold"
      >
        {submitting ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Placing your order…
          </>
        ) : (
          <>
            Place Order
            <ArrowRight className="ml-2 h-5 w-5" />
          </>
        )}
      </Button>
    </form>
  );
}

function SuccessView({ orderId, phone, onReset }: SuccessState & { onReset: () => void }) {
  const confetti = Array.from({ length: 24 });
  const colors = ['#1B4332', '#D4A017', '#40916C', '#B07D10', '#52B788'];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="relative flex flex-col items-center justify-center overflow-hidden rounded-2xl border border-forest-100 bg-white px-6 py-16 text-center shadow-card-warm"
    >
      {/* Confetti */}
      {confetti.map((_, i) => {
        const angle = (i / confetti.length) * Math.PI * 2;
        const distance = 120 + Math.random() * 80;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;
        return (
          <motion.div
            key={i}
            className="absolute left-1/2 top-1/2 h-3 w-3 rounded-full"
            style={{ backgroundColor: colors[i % colors.length] }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 0 }}
            animate={{ x, y, opacity: 0, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.1 + i * 0.02, ease: 'easeOut' }}
          />
        );
      })}

      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.15 }}
        className="mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-forest-100 ring-8 ring-forest-100"
      >
        <CheckCircle2 className="h-10 w-10 text-forest-600" strokeWidth={2.5} />
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="font-heading text-2xl font-extrabold text-brown-900 sm:text-3xl"
      >
        Your Order has been placed!
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-3 max-w-md text-base text-brown-700"
      >
        We will call you on{' '}
        <span className="font-bold text-brown-900">{formatPhone(phone)}</span>{' '}
        when your order is ready for collection.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-7 flex flex-col gap-3 sm:flex-row"
      >
        <Link href="/">
          <Button variant="outline" size="lg" className="h-12 w-full border-forest-700 text-forest-800 hover:bg-forest-50 sm:w-auto">
            <Home className="mr-2 h-5 w-5" />
            Back to Home
          </Button>
        </Link>
          <Button size="lg" className="h-12 w-full bg-forest-700 text-beige-100 hover:bg-forest-800 sm:w-auto" onClick={onReset}>
            <Sparkles className="mr-2 h-5 w-5" />
            Place Another Order
          </Button>
      </motion.div>
    </motion.div>
  );
}
