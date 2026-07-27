'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Phone } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { config, navLinks } from '@/lib/config';
import { cn } from '@/lib/utils';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled
          ? 'bg-beige-100/90 backdrop-blur-xl shadow-warm border-b border-beige-300'
          : 'bg-transparent',
      )}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="group flex items-center gap-2.5">
          <motion.div
            initial={{ rotate: -8, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-warm ring-1 ring-gold-500/30"
          >
            <Logo className="h-7 w-7" />
          </motion.div>
          <div className="flex flex-col leading-none">
            <span className="font-heading text-base font-extrabold text-forest-800 sm:text-lg">
              {config.shopName}
            </span>
            <span className="hidden text-xs font-medium text-brown-500 sm:block">
              Wholesale Grocery · Surat
            </span>
          </div>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="relative rounded-lg px-4 py-2 text-base font-medium text-brown-900 transition-colors hover:bg-forest-50 hover:text-forest-700"
            >
              {link.label}
            </Link>
          ))}
          <a
            href={config.phoneTel}
            className="ml-2 inline-flex h-10 items-center gap-2 rounded-full bg-forest-700 px-5 text-base font-semibold text-beige-100 shadow-warm transition-all hover:bg-forest-800"
          >
            <Phone className="h-4 w-4" />
            Call Now
          </a>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen(true)}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-forest-800 md:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-6 w-6" />
        </button>
      </nav>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-brown-900/40 backdrop-blur-sm md:hidden"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="fixed right-0 top-0 z-50 h-full w-72 bg-beige-100 shadow-card-warm md:hidden"
            >
              <div className="flex items-center justify-between border-b border-beige-300 px-5 py-4">
                <div className="flex items-center gap-2">
                  <Logo className="h-7 w-7" />
                  <span className="font-heading text-base font-bold text-forest-800">
                    {config.shopName}
                  </span>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-forest-800"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex flex-col gap-1 p-4">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i + 0.1 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="block rounded-xl px-4 py-3 text-lg font-medium text-brown-900 transition-colors hover:bg-forest-50 hover:text-forest-700"
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
                <a
                  href={config.phoneTel}
                  className="mt-3 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-forest-700 px-4 text-base font-semibold text-beige-100"
                >
                  <Phone className="h-5 w-5" />
                  Call {config.phoneDisplay}
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
}
