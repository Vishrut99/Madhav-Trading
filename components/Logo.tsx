import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={cn('h-8 w-8', className)}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="logo-green" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1B4332" />
          <stop offset="100%" stopColor="#2D6A4F" />
        </linearGradient>
        <linearGradient id="logo-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#D4A017" />
          <stop offset="100%" stopColor="#B07D10" />
        </linearGradient>
      </defs>
      
      {/* M shape with a thick, modern line */}
      <path
        d="M14 50 L14 20 C14 16 16 14 20 14 L32 32 L44 14 C48 14 50 16 50 20 L50 50"
        stroke="url(#logo-green)"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Leaf / Sprout shape above the center of M */}
      <path
        d="M32 28 C32 18 42 10 42 10 C42 10 44 18 32 28 Z"
        fill="url(#logo-gold)"
      />
      <path
        d="M32 28 C32 18 22 10 22 10 C22 10 20 18 32 28 Z"
        fill="url(#logo-gold)"
        opacity="0.9"
      />
      {/* Small dot/seed in the middle */}
      <circle cx="32" cy="18" r="3" fill="#1B4332" />
    </svg>
  );
}
