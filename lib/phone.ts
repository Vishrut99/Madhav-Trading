export function formatPhone(raw: string): string {
  const digits = (raw || '').replace(/\D/g, '').slice(-10);
  if (digits.length !== 10) return raw;
  return `${digits.slice(0, 5)} ${digits.slice(5)}`;
}

export function normalizePhone(raw: string): string {
  return (raw || '').replace(/\D/g, '').slice(-10);
}

export function validateIndianPhone(raw: string): boolean {
  const digits = normalizePhone(raw);
  if (digits.length !== 10) return false;
  const first = digits.charAt(0);
  return first === '6' || first === '7' || first === '8' || first === '9';
}
