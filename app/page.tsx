'use client';

import Link from 'next/link';
import { lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import {
  Phone,
  MapPin,
  Clock,
  Truck,
  ShieldCheck,
  BadgeCheck,
  Users,
  ArrowRight,
  Wheat,
  Sparkles,
  Package,
  Star,
  Quote,
  Mail,
} from 'lucide-react';
import { config, productCategories } from '@/lib/config';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { TiltCard } from '@/components/TiltCard';
import { AnimatedNumber } from '@/components/AnimatedNumber';

const HeroParticles = lazy(() => import('@/components/HeroParticles'));

const SITE = {
  name: config.shopName,
  tagline: config.tagline,
  taglineGu: 'કઠોળ, સુકા મેવા, કરિયાણા અને મસાલાના હોલસેલ સપ્લાયર',
  phone: config.phoneRaw,
  phoneDisplay: config.phoneDisplay,
  email: config.email,
  owner: config.owner,
  mapsUrl: config.mapsLink,
  mapsEmbed: config.mapsEmbed,
  address: `${config.address.line1}, ${config.address.line2}, ${config.address.line3}, ${config.address.line4}`,
  hours: [
    { day: 'Monday to Saturday', time: config.hours.weekdays.replace('Monday to Saturday, ', '') },
    { day: 'Sunday', time: config.hours.weekend.replace('Sunday: ', '') },
  ],
  categories: productCategories.map((c) => ({ name: c.name, nameGu: c.gujarati })),
};

const fadeUpVariant = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-beige-100">
      <Navbar />
      <Hero />
      <Trust />
      <About />
      <WhyUs />
      <Products />
      <Delivery />
      <Hours />
      <MapSection />
      <Reviews />
      <Contact />
      <Footer />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-grain pt-20 perspective-[1000px]">
      <Suspense fallback={null}>
        <HeroParticles />
      </Suspense>

      <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:py-24 md:grid-cols-[1.2fr_1fr] md:py-28">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.span
            variants={fadeUpVariant}
            className="inline-flex items-center gap-2 rounded-full border border-forest-700/20 bg-white/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-forest-800 sm:text-sm"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Wholesale Grocery
          </motion.span>

          <motion.h1
            variants={fadeUpVariant}
            className="mt-5 font-heading text-4xl font-bold leading-[1.05] text-brown-900 sm:text-5xl md:text-6xl"
          >
            {SITE.name}
          </motion.h1>

          <motion.p
            variants={fadeUpVariant}
            className="mt-4 max-w-xl text-lg text-brown-700 sm:text-xl"
          >
            {SITE.tagline}.
            <span className="mt-1 block text-base font-medium text-forest-700 sm:text-lg">
              {SITE.taglineGu}
            </span>
          </motion.p>

          <motion.p
            variants={fadeUpVariant}
            className="mt-6 max-w-xl text-base leading-relaxed text-brown-700 sm:text-lg"
          >
            Rice, dal, flour, oil, sugar and spices at fair wholesale prices. Trusted by kirana
            stores and families.
          </motion.p>

          <motion.div variants={fadeUpVariant} className="mt-9 flex flex-col gap-3 sm:flex-row sm:gap-4">
            <Link
              href="/order"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-forest-700 px-8 py-4 text-lg font-bold text-beige-100 shadow-forest transition hover:bg-forest-800 hover:scale-105 active:scale-95"
            >
              Place Order
              <ArrowRight className="h-5 w-5" />
            </Link>
            <a
              href={`tel:${SITE.phone}`}
              className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-forest-700 bg-white px-8 py-4 text-lg font-bold text-forest-800 transition hover:bg-forest-50 hover:scale-105 active:scale-95"
            >
              <Phone className="h-5 w-5" />
              Call {SITE.phoneDisplay}
            </a>
          </motion.div>

          <motion.div variants={fadeUpVariant} className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-brown-700">
            <span className="inline-flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-forest-700" /> Quality Assured
            </span>
            <span className="inline-flex items-center gap-2">
              <Truck className="h-4 w-4 text-forest-700" /> Fast Delivery
            </span>
            <span className="inline-flex items-center gap-2">
              <BadgeCheck className="h-4 w-4 text-forest-700" /> Wholesale Prices
            </span>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotateY: -15 }}
          animate={{ opacity: 1, scale: 1, rotateY: 0 }}
          transition={{ duration: 0.8, delay: 0.2, type: 'spring' }}
          className="relative hidden md:block"
        >
          <TiltCard rotationIntensity={20}>
            <div className="relative rounded-3xl bg-forest-700 p-8 text-beige-100 shadow-[0_20px_50px_rgba(27,67,50,0.5)] border border-forest-600 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
              <div className="absolute -right-6 -top-6 flex h-24 w-24 items-center justify-center rounded-full bg-gold-500 shadow-gold transform translate-z-[60px]">
                <Wheat className="h-12 w-12 text-brown-900 drop-shadow-md" />
              </div>
              <div className="grid grid-cols-2 gap-4 relative z-10 transform translate-z-[30px]">
                {SITE.categories.slice(0, 4).map((c) => (
                  <div key={c.name} className="rounded-2xl bg-white/10 p-4 backdrop-blur shadow-inner border border-white/10 transition-transform hover:-translate-y-1 hover:bg-white/20">
                    <Package className="h-6 w-6 text-gold-300 drop-shadow" />
                    <div className="mt-3 text-sm font-semibold text-white shadow-black">{c.name}</div>
                    <div className="text-xs text-beige-200">{c.nameGu}</div>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-2xl bg-white p-5 text-brown-900 shadow-xl relative z-10 transform translate-z-[50px] transition-transform hover:scale-105">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-500 shadow-inner">
                    <Phone className="h-5 w-5 text-brown-900" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold uppercase tracking-wider text-brown-500">
                      Call to Order
                    </div>
                    <div className="text-lg font-bold text-forest-800">{SITE.phoneDisplay}</div>
                  </div>
                </div>
              </div>
            </div>
          </TiltCard>
        </motion.div>
      </div>
    </section>
  );
}

function Trust() {
  const stats = [
    { icon: Users, label: 'Happy Retailers', value: 500, suffix: '+' },
    { icon: Package, label: 'Products', value: 200, suffix: '+' },
    { icon: Truck, label: 'Fast Delivery', value: 'Same Day' },
    { icon: ShieldCheck, label: 'Trusted Service', value: 'Years' },
  ];
  return (
    <section className="border-y border-beige-300 bg-white relative z-10">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        variants={staggerContainer}
        className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 py-10 sm:grid-cols-4 sm:gap-8"
      >
        {stats.map((s) => (
          <motion.div variants={fadeUpVariant} key={s.label} className="text-center group">
            <motion.div whileHover={{ scale: 1.2, rotate: 5 }} className="inline-block">
              <s.icon className="mx-auto h-6 w-6 text-forest-700 sm:h-7 sm:w-7 transition-colors group-hover:text-gold-600" />
            </motion.div>
            <div className="mt-2 font-heading text-2xl font-bold text-brown-900 sm:text-3xl">
              {typeof s.value === 'number' ? (
                <AnimatedNumber value={s.value} suffix={s.suffix} />
              ) : (
                s.value
              )}
            </div>
            <div className="text-xs font-medium text-brown-700 sm:text-sm">{s.label}</div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

function SectionHeader({ eyebrow, title, sub }: { eyebrow: string; title: string; sub?: string }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={staggerContainer}
      className="mx-auto max-w-2xl text-center"
    >
      <motion.span variants={fadeUpVariant} className="text-xs font-semibold uppercase tracking-widest text-forest-700">
        {eyebrow}
      </motion.span>
      <motion.h2 variants={fadeUpVariant} className="mt-3 font-heading text-3xl font-bold text-brown-900 sm:text-4xl md:text-5xl">
        {title}
      </motion.h2>
      {sub && <motion.p variants={fadeUpVariant} className="mt-4 text-base text-brown-700 sm:text-lg">{sub}</motion.p>}
    </motion.div>
  );
}

function About() {
  return (
    <section id="about" className="mx-auto max-w-6xl px-4 py-20 sm:py-24 overflow-hidden">
      <div className="grid gap-12 md:grid-cols-2 md:items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <span className="text-xs font-semibold uppercase tracking-widest text-forest-700">
            About Us
          </span>
          <h2 className="mt-3 font-heading text-3xl font-bold text-brown-900 sm:text-4xl md:text-5xl">
            A family name kirana stores trust.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-brown-700 sm:text-lg">
            {SITE.name} has been supplying quality grocery essentials at honest wholesale prices
            for years. Owned and personally run by {SITE.owner}, our shop is the go-to source for
            kirana store owners, small businesses and families who value quality and fair dealing.
          </p>
          <p className="mt-4 text-base leading-relaxed text-brown-700 sm:text-lg">
            You already know what you need. Just call, message, or place your order online and we
            handle the rest.
          </p>
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href={`tel:${SITE.phone}`}
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-forest-700 px-6 py-3.5 text-base font-semibold text-beige-100 shadow-forest transition hover:bg-forest-800"
          >
            <Phone className="h-5 w-5" /> Talk to {SITE.owner.split(' ')[0]}
          </motion.a>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer}
          className="grid grid-cols-2 gap-4 perspective-[1000px]"
        >
          <TiltCard rotationIntensity={10}>
            <motion.div variants={fadeUpVariant} className="rounded-3xl bg-forest-700 p-8 text-beige-100 shadow-[0_15px_30px_rgba(27,67,50,0.4)] transform translate-z-[30px] border border-forest-600">
              <BadgeCheck className="h-8 w-8 text-gold-300 drop-shadow" />
              <div className="mt-4 font-heading text-4xl font-bold text-white drop-shadow-sm">
                <AnimatedNumber value={100} suffix="%" />
              </div>
              <div className="mt-1 text-sm text-beige-200">Genuine Quality</div>
            </motion.div>
          </TiltCard>
          <TiltCard rotationIntensity={10} className="mt-8">
            <motion.div variants={fadeUpVariant} className="rounded-3xl bg-white p-8 shadow-[0_15px_30px_rgba(0,0,0,0.1)] transform translate-z-[30px] border border-beige-200">
              <Users className="h-8 w-8 text-forest-700 drop-shadow" />
              <div className="mt-4 font-heading text-4xl font-bold text-brown-900 drop-shadow-sm">
                <AnimatedNumber value={500} suffix="+" />
              </div>
              <div className="mt-1 text-sm text-brown-700">Regular Buyers</div>
            </motion.div>
          </TiltCard>
          <TiltCard rotationIntensity={10}>
            <motion.div variants={fadeUpVariant} className="rounded-3xl bg-white p-8 shadow-[0_15px_30px_rgba(0,0,0,0.1)] transform translate-z-[30px] border border-beige-200">
              <Truck className="h-8 w-8 text-forest-700 drop-shadow" />
              <div className="mt-4 font-heading text-4xl font-bold text-brown-900 drop-shadow-sm">Fast</div>
              <div className="mt-1 text-sm text-brown-700">Local Delivery</div>
            </motion.div>
          </TiltCard>
          <TiltCard rotationIntensity={10} className="mt-8">
            <motion.div variants={fadeUpVariant} className="rounded-3xl bg-gold-500 p-8 text-brown-900 shadow-[0_15px_30px_rgba(212,160,23,0.4)] transform translate-z-[30px] border border-gold-400">
              <Sparkles className="h-8 w-8 drop-shadow" />
              <div className="mt-4 font-heading text-4xl font-bold drop-shadow-sm">Fair</div>
              <div className="mt-1 text-sm opacity-90">Wholesale Prices</div>
            </motion.div>
          </TiltCard>
        </motion.div>
      </div>
    </section>
  );
}

function WhyUs() {
  const items = [
    {
      icon: ShieldCheck,
      title: 'Trusted Quality',
      desc: 'Every sack, every packet checked before it leaves our shop.',
    },
    {
      icon: BadgeCheck,
      title: 'Honest Prices',
      desc: 'Real wholesale rates and no hidden charges.',
    },
    {
      icon: Truck,
      title: 'Quick Delivery',
      desc: 'Local delivery available. Tell us when and where.',
    },
    {
      icon: Users,
      title: 'Personal Service',
      desc: 'Speak directly with the owner.',
    },
  ];
  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeader
          eyebrow="Why Choose Us"
          title="What makes us different."
          sub="Simple values that keep our customers coming back."
        />
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer}
          className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4 perspective-[1000px]"
        >
          {items.map((f, i) => (
            <motion.div key={f.title} variants={fadeUpVariant}>
              <TiltCard rotationIntensity={15} className="h-full">
                <div className="group h-full rounded-3xl border border-beige-300 bg-beige-100 p-7 shadow-warm transition-all duration-300 transform translate-z-[20px] hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)] hover:border-forest-300 bg-gradient-to-br from-beige-100 to-white">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-forest-700 shadow-[0_5px_15px_rgba(27,67,50,0.4)] transition transform group-hover:scale-110 group-hover:-translate-y-1 group-hover:rotate-3 translate-z-[30px]">
                    <f.icon className="h-7 w-7 text-beige-100" />
                  </div>
                  <h3 className="mt-5 font-heading text-xl font-bold text-brown-900 transform translate-z-[10px]">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-brown-700 transform translate-z-[10px]">{f.desc}</p>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function Products() {
  return (
    <section id="products" className="mx-auto max-w-6xl px-4 py-20 sm:py-24">
      <SectionHeader
        eyebrow="Wholesale Products"
        title="Everything a kirana store needs."
        sub="From daily staples to festival essentials — all under one roof."
      />
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        variants={staggerContainer}
        className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 perspective-[1000px]"
      >
        {SITE.categories.map((c) => (
          <motion.div key={c.name} variants={fadeUpVariant}>
            <TiltCard rotationIntensity={15} className="h-full">
              <div className="group relative overflow-hidden h-full rounded-3xl border border-beige-300 bg-white p-6 shadow-warm transition-all duration-300 transform translate-z-[20px] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:border-forest-400 bg-gradient-to-br from-white to-beige-50">
                <div className="absolute inset-0 bg-forest-700/0 group-hover:bg-forest-700/5 transition-colors duration-300 pointer-events-none" />
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-beige-100 transform transition group-hover:scale-110 group-hover:-translate-y-1 translate-z-[30px] shadow-sm">
                  <Package className="h-7 w-7 text-forest-700" />
                </div>
                <h3 className="mt-5 font-heading text-lg font-bold text-brown-900 transform translate-z-[10px]">{c.name}</h3>
                <p className="mt-1 text-sm font-medium text-forest-700 transform translate-z-[10px]">{c.nameGu}</p>
              </div>
            </TiltCard>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.7, type: 'spring', bounce: 0.4 }}
      >
        <TiltCard rotationIntensity={5}>
          <div className="mt-12 rounded-3xl bg-gradient-to-br from-forest-700 to-forest-800 p-8 text-center text-beige-100 shadow-[0_25px_50px_rgba(27,67,50,0.5)] border border-forest-600 sm:p-12 transform translate-z-[30px] overflow-hidden relative">
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-gold-500 opacity-10 rounded-full blur-3xl pointer-events-none" />
            
            <h3 className="font-heading text-2xl font-bold sm:text-3xl relative z-10 text-white drop-shadow-md">Need something specific?</h3>
            <p className="mx-auto mt-3 max-w-xl text-beige-100/90 relative z-10">
              Just call and ask. We stock hundreds of items and can source almost anything a shop
              needs.
            </p>
            <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row relative z-10">
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href={`tel:${SITE.phone}`}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-4 text-base font-bold text-forest-800 shadow-[0_10px_20px_rgba(0,0,0,0.2)]"
              >
                <Phone className="h-5 w-5" /> Call {SITE.phoneDisplay}
              </motion.a>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href="/order"
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-gold-500 px-6 py-4 text-base font-bold text-brown-900 shadow-[0_10px_20px_rgba(212,160,23,0.4)]"
                >
                  Place Order Online <ArrowRight className="h-5 w-5" />
                </Link>
              </motion.div>
            </div>
          </div>
        </TiltCard>
      </motion.div>
    </section>
  );
}

function Delivery() {
  return (
    <section className="bg-white py-20 sm:py-24 overflow-hidden">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 md:grid-cols-2 md:items-center">
        <motion.div
          initial={{ opacity: 0, x: -50, rotateY: 15 }}
          whileInView={{ opacity: 1, x: 0, rotateY: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, type: 'spring' }}
          className="perspective-[1000px]"
        >
          <TiltCard rotationIntensity={15}>
            <div className="rounded-3xl bg-gradient-to-br from-beige-100 to-white p-8 shadow-[0_20px_40px_rgba(0,0,0,0.08)] border border-beige-200 sm:p-12 transform translate-z-[30px]">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-forest-700 shadow-[0_10px_20px_rgba(27,67,50,0.3)] transform translate-z-[40px] -translate-y-2">
                <Truck className="h-8 w-8 text-beige-100" />
              </div>
              <h3 className="mt-6 font-heading text-3xl font-bold text-brown-900 sm:text-4xl transform translate-z-[20px]">
                Local Delivery Available
              </h3>
              <p className="mt-4 text-base leading-relaxed text-brown-700 sm:text-lg transform translate-z-[10px]">
                We deliver bulk orders to kirana stores and regular customers around our area. Same-day
                dispatch where possible.
              </p>
              <ul className="mt-6 space-y-3 text-base transform translate-z-[10px]">
                <li className="flex items-start gap-3">
                  <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-forest-700" />
                  <span>Same-day dispatch for local orders placed before noon.</span>
                </li>
                <li className="flex items-start gap-3">
                  <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-forest-700" />
                  <span>Careful handling of every sack and packet.</span>
                </li>
                <li className="flex items-start gap-3">
                  <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-forest-700" />
                  <span>Cash on delivery for regular customers.</span>
                </li>
              </ul>
            </div>
          </TiltCard>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, delay: 0.2, ease: 'easeOut' }}
        >
          <span className="text-xs font-semibold uppercase tracking-widest text-forest-700">
            Delivery
          </span>
          <h2 className="mt-3 font-heading text-3xl font-bold text-brown-900 sm:text-4xl md:text-5xl">
            We come to your shop.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-brown-700 sm:text-lg">
            Skip the trip. Send us your list by phone, WhatsApp or this website and we deliver
            straight to your shop or home.
          </p>
          <motion.a
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            href={`tel:${SITE.phone}`}
            className="mt-7 inline-flex items-center gap-2 rounded-full bg-forest-700 px-6 py-4 text-base font-semibold text-beige-100 shadow-forest transition hover:bg-forest-800"
          >
            <Phone className="h-5 w-5" /> Arrange Delivery
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}

function Hours() {
  return (
    <section id="hours" className="mx-auto max-w-6xl px-4 py-20 sm:py-24">
      <SectionHeader
        eyebrow="Working Hours"
        title="Open all week."
        sub="Come in, call, or place an order — we're here to help."
      />
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        variants={staggerContainer}
        className="mx-auto mt-12 grid max-w-3xl gap-4 sm:grid-cols-2 perspective-[1000px]"
      >
        {SITE.hours.map((h) => (
          <motion.div key={h.day} variants={fadeUpVariant}>
            <TiltCard rotationIntensity={10}>
              <div className="flex items-center gap-5 rounded-3xl bg-white p-6 shadow-[0_10px_30px_rgba(0,0,0,0.08)] border border-beige-200 transform translate-z-[20px] transition-transform hover:scale-105">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gold-500 shadow-[0_5px_15px_rgba(212,160,23,0.3)] transform translate-z-[30px]">
                  <Clock className="h-7 w-7 text-brown-900" />
                </div>
                <div className="transform translate-z-[10px]">
                  <div className="text-lg font-bold text-brown-900">{h.day}</div>
                  <div className="mt-0.5 text-base font-medium text-forest-700">{h.time}</div>
                </div>
              </div>
            </TiltCard>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

function MapSection() {
  return (
    <section className="bg-white py-20 sm:py-24 overflow-hidden">
      <div className="mx-auto max-w-6xl px-4">
        <SectionHeader
          eyebrow="Find Us"
          title="Visit our shop."
          sub="Come see the sacks, the shelves and the freshly delivered stock."
        />
        <motion.div
          initial={{ opacity: 0, y: 50, rotateX: 10 }}
          whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, type: 'spring' }}
          className="mt-12 overflow-hidden rounded-3xl bg-white shadow-[0_30px_60px_rgba(0,0,0,0.12)] border border-beige-200"
        >
          <div className="aspect-[16/10] w-full relative">
            <div className="absolute inset-0 bg-forest-900/5 pointer-events-none" />
            <iframe
              title={`${SITE.name} on Google Maps`}
              src={SITE.mapsEmbed}
              className="h-full w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
          <div className="flex flex-col items-start justify-between gap-4 p-6 sm:flex-row sm:items-center bg-gradient-to-r from-beige-50 to-white">
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-5 w-5 text-forest-700" />
              <div>
                <div className="text-base font-semibold text-brown-900">{SITE.name}</div>
                <div className="text-sm text-brown-700">{SITE.address}</div>
              </div>
            </div>
            <motion.a
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              href={SITE.mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-forest-700 px-6 py-3 text-sm font-semibold text-beige-100 shadow-forest transition hover:bg-forest-800"
            >
              Open in Google Maps <ArrowRight className="h-4 w-4" />
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function Reviews() {
  const reviews = [
    {
      name: 'Kirana Store Owner',
      role: 'Regular Customer',
      text: 'Rates fair che, quality pan sari. Delivery time-sar aavi jay che. Very reliable shop.',
      rating: 5,
    },
    {
      name: 'Retail Buyer',
      role: 'Small Business',
      text: 'Bhadreshbhai is very honest. I order every week and quality is always good.',
      rating: 5,
    },
    {
      name: 'Local Family',
      role: 'Household Customer',
      text: 'Best wholesale prices in the area. We buy monthly groceries here for years now.',
      rating: 5,
    },
  ];
  return (
    <section className="mx-auto max-w-6xl px-4 py-20 sm:py-24">
      <SectionHeader
        eyebrow="Customer Reviews"
        title="What our customers say."
        sub="Words from the kirana owners and families who buy with us."
      />
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-100px' }}
        variants={staggerContainer}
        className="mt-14 grid gap-6 md:grid-cols-3 perspective-[1000px]"
      >
        {reviews.map((r) => (
          <motion.div key={r.name} variants={fadeUpVariant}>
            <TiltCard rotationIntensity={15} className="h-full">
              <div className="h-full rounded-3xl bg-white p-7 shadow-[0_15px_30px_rgba(0,0,0,0.08)] border border-beige-200 transform translate-z-[20px] transition-transform hover:shadow-[0_25px_50px_rgba(0,0,0,0.15)] bg-gradient-to-b from-white to-beige-50">
                <Quote className="h-8 w-8 text-gold-500 drop-shadow transform translate-z-[20px]" />
                <div className="mt-3 flex gap-1 transform translate-z-[15px]">
                  {Array.from({ length: r.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-gold-500 text-gold-500" />
                  ))}
                </div>
                <p className="mt-4 text-base leading-relaxed text-brown-900 font-medium transform translate-z-[10px]">
                  &ldquo;{r.text}&rdquo;
                </p>
                <div className="mt-6 border-t border-beige-300 pt-4 transform translate-z-[10px]">
                  <div className="text-sm font-bold text-brown-900">{r.name}</div>
                  <div className="text-xs text-brown-700">{r.role}</div>
                </div>
              </div>
            </TiltCard>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="bg-white py-20 sm:py-24 overflow-hidden">
      <div className="mx-auto max-w-4xl px-4">
        <SectionHeader
          eyebrow="Contact"
          title="Get in touch."
          sub="Call, email or drop by the shop — whichever is easiest."
        />
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={staggerContainer}
          className="mt-12 grid gap-5 sm:grid-cols-3 perspective-[1000px]"
        >
          <motion.div variants={fadeUpVariant}>
            <TiltCard rotationIntensity={20} className="h-full">
              <a
                href={`tel:${SITE.phone}`}
                className="block h-full group rounded-3xl bg-gradient-to-br from-beige-100 to-white p-7 text-center shadow-[0_15px_30px_rgba(0,0,0,0.08)] border border-beige-200 transition-all transform translate-z-[20px] hover:shadow-[0_25px_50px_rgba(0,0,0,0.15)] hover:border-forest-300"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-forest-700 shadow-[0_10px_20px_rgba(27,67,50,0.4)] transition transform group-hover:scale-110 group-hover:-translate-y-2 translate-z-[30px]">
                  <Phone className="h-7 w-7 text-beige-100" />
                </div>
                <div className="mt-5 text-xs font-semibold uppercase tracking-wider text-brown-700 transform translate-z-[10px]">
                  Call
                </div>
                <div className="mt-2 text-lg font-bold text-brown-900 transform translate-z-[10px]">{SITE.phoneDisplay}</div>
              </a>
            </TiltCard>
          </motion.div>

          <motion.div variants={fadeUpVariant}>
            <TiltCard rotationIntensity={20} className="h-full">
              <a
                href={`mailto:${SITE.email}`}
                className="block h-full group rounded-3xl bg-gradient-to-br from-beige-100 to-white p-7 text-center shadow-[0_15px_30px_rgba(0,0,0,0.08)] border border-beige-200 transition-all transform translate-z-[20px] hover:shadow-[0_25px_50px_rgba(0,0,0,0.15)] hover:border-gold-400"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gold-500 shadow-[0_10px_20px_rgba(212,160,23,0.4)] transition transform group-hover:scale-110 group-hover:-translate-y-2 translate-z-[30px]">
                  <Mail className="h-7 w-7 text-brown-900" />
                </div>
                <div className="mt-5 text-xs font-semibold uppercase tracking-wider text-brown-700 transform translate-z-[10px]">
                  Email
                </div>
                <div className="mt-2 break-all text-base font-bold text-brown-900 transform translate-z-[10px]">{SITE.email}</div>
              </a>
            </TiltCard>
          </motion.div>

          <motion.div variants={fadeUpVariant}>
            <TiltCard rotationIntensity={20} className="h-full">
              <a
                href={SITE.mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="block h-full group rounded-3xl bg-gradient-to-br from-beige-100 to-white p-7 text-center shadow-[0_15px_30px_rgba(0,0,0,0.08)] border border-beige-200 transition-all transform translate-z-[20px] hover:shadow-[0_25px_50px_rgba(0,0,0,0.15)] hover:border-forest-300"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-forest-700 shadow-[0_10px_20px_rgba(27,67,50,0.4)] transition transform group-hover:scale-110 group-hover:-translate-y-2 translate-z-[30px]">
                  <MapPin className="h-7 w-7 text-beige-100" />
                </div>
                <div className="mt-5 text-xs font-semibold uppercase tracking-wider text-brown-700 transform translate-z-[10px]">
                  Visit
                </div>
                <div className="mt-2 text-lg font-bold text-brown-900 transform translate-z-[10px]">Google Maps</div>
              </a>
            </TiltCard>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6, type: 'spring' }}
          className="mt-10 rounded-3xl bg-gradient-to-br from-forest-700 to-forest-800 p-8 text-center text-beige-100 shadow-[0_30px_60px_rgba(27,67,50,0.4)] relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent pointer-events-none" />
          <h3 className="font-heading text-2xl font-bold sm:text-3xl relative z-10 text-white drop-shadow">Ready to order?</h3>
          <p className="mx-auto mt-3 max-w-md text-beige-100/90 relative z-10">
            Send us your grocery list and we&apos;ll take care of everything.
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="relative z-10 inline-block mt-6">
            <Link
              href="/order"
              className="inline-flex items-center gap-2 rounded-full bg-gold-500 px-8 py-4 text-lg font-bold text-brown-900 shadow-[0_10px_30px_rgba(212,160,23,0.5)] transition hover:bg-gold-400"
            >
              Place Order Now <ArrowRight className="h-5 w-5" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
