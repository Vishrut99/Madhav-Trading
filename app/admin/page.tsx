'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { LogOut, ClipboardList } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/Logo';
import { AdminTabs } from '@/components/AdminTabs';
import { config } from '@/lib/config';

export default function AdminDashboardPage() {
  const router = useRouter();

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-beige-100">
      {/* Top bar */}
      <header className="sticky top-0 z-40 border-b border-beige-300 bg-white/90 backdrop-blur-xl shadow-warm">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-beige-100 shadow-warm ring-1 ring-gold-500/30">
              <Logo className="h-7 w-7" />
            </div>
            <div>
              <p className="font-heading text-base font-extrabold text-forest-800">
                {config.shopName}
              </p>
              <p className="text-xs font-medium text-brown-500">Admin Dashboard</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={logout} className="h-10 border-brown-300 text-brown-700 hover:bg-beige-100">
            <LogOut className="mr-1.5 h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      {/* Content */}
      <motion.main
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8"
      >
        <div className="mb-6 flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-forest-700" />
          <h1 className="font-heading text-xl font-extrabold text-brown-900">
            Orders
          </h1>
        </div>

        <AdminTabs />
      </motion.main>
    </div>
  );
}
