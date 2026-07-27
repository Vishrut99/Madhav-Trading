'use client';

import { motion } from 'framer-motion';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { OrderForm } from '@/components/OrderForm';
import { Logo } from '@/components/Logo';
import { config } from '@/lib/config';

export default function OrderPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-grain bg-beige-100 pt-20">
        <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:py-16">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-8 text-center"
          >
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white shadow-warm ring-1 ring-gold-500/30">
              <Logo className="h-9 w-9" />
            </div>
            <h1 className="font-heading text-3xl font-extrabold text-brown-900 sm:text-4xl">
              Place Your Order
            </h1>
            <p className="mx-auto mt-3 max-w-md text-base text-brown-700">
              Fill in the form below with your order details, or upload a photo of
              your order list. We&apos;ll call you when it&apos;s ready.
            </p>
          </motion.div>

          {/* Form card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="rounded-2xl border border-beige-300 bg-white p-6 shadow-card-warm sm:p-8"
          >
            <OrderForm />
          </motion.div>

          {/* Help note */}
          <p className="mt-6 text-center text-sm text-brown-500">
            Prefer to order by phone? Call us at{' '}
            <a href={config.phoneTel} className="font-semibold text-forest-700 hover:text-forest-800">
              {config.phoneDisplay}
            </a>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
