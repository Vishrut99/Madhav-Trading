'use client';

import { cn } from '@/lib/utils';
import { validateIndianPhone, normalizePhone } from '@/lib/phone';

interface PhoneInputProps {
  value: string;
  onChange: (raw: string) => void;
  error?: string;
}

export function PhoneInput({ value, onChange, error }: PhoneInputProps) {
  const digits = normalizePhone(value);
  const display = digits.length > 5 ? `${digits.slice(0, 5)} ${digits.slice(5)}` : digits;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = normalizePhone(e.target.value);
    onChange(raw);
  };

  const isValid = value ? validateIndianPhone(value) : null;

  return (
    <div className="space-y-2">
      <div
        className={cn(
          'rounded-xl border-2 bg-white transition-all',
          error
            ? 'border-destructive ring-1 ring-destructive/20'
            : isValid
              ? 'border-forest-500 ring-1 ring-forest-100'
              : 'border-beige-400 focus-within:border-forest-600 focus-within:ring-2 focus-within:ring-forest-100',
        )}
      >
        <input
          type="tel"
          inputMode="numeric"
          value={display}
          onChange={handleChange}
          placeholder="98765 43210"
          maxLength={11}
          className="h-12 w-full bg-transparent px-3.5 text-base font-medium text-brown-900 outline-none placeholder:text-brown-300"
        />
      </div>
      {error && <p className="text-sm font-medium text-destructive">{error}</p>}
    </div>
  );
}
