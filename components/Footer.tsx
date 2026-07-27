import Link from 'next/link';
import { Phone, Mail, MapPin, Clock } from 'lucide-react';
import { config } from '@/lib/config';

const siteHours = [
  { day: 'Monday to Saturday', time: config.hours.weekdays.replace('Monday to Saturday, ', '') },
  { day: 'Sunday', time: config.hours.weekend.replace('Sunday: ', '') },
];

export function Footer() {
  return (
    <footer className="mt-20 border-t border-beige-300 bg-forest-900 text-beige-200">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <h3 className="font-heading text-2xl font-bold text-white">{config.shopName}</h3>
            <p className="mt-3 text-sm leading-relaxed text-beige-300">
              {config.tagline}. Trusted by kirana stores and families for quality grains, dal,
              oil and daily essentials.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gold-400">
              Contact
            </h4>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 text-gold-400" />
                <a href={config.phoneTel} className="hover:text-gold-300">
                  {config.phoneDisplay}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 text-gold-400" />
                <a href={`mailto:${config.email}`} className="hover:text-gold-300">
                  {config.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 text-gold-400" />
                <a href={config.mapsLink} target="_blank" rel="noreferrer" className="hover:text-gold-300">
                  View on Google Maps
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-gold-400">
              Working Hours
            </h4>
            <ul className="mt-4 space-y-2 text-sm">
              {siteHours.map((h) => (
                <li key={h.day} className="flex items-start gap-3">
                  <Clock className="mt-0.5 h-4 w-4 text-gold-400" />
                  <span>
                    <span className="block font-medium">{h.day}</span>
                    <span className="text-beige-300">{h.time}</span>
                  </span>
                </li>
              ))}
            </ul>
            <Link
              href="/order"
              className="mt-6 inline-flex items-center rounded-full bg-gold-500 px-5 py-3 text-sm font-semibold text-brown-900 shadow-gold transition hover:bg-gold-400"
            >
              Place an Order
            </Link>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-white/15 pt-6 text-xs text-beige-300 sm:flex-row sm:items-center">
          <p>
            © {new Date().getFullYear()} {config.shopName}. Owned by {config.owner}.
          </p>
          <Link href="/admin/login" className="hover:text-gold-300">
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
}
