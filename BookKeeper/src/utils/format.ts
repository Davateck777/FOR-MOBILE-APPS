export function formatMoney(amount: number, symbol: string = '₦'): string {
  const sign = amount < 0 ? '-' : '';
  const abs = Math.abs(amount);
  const withCommas = abs.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return `${sign}${symbol}${withCommas}`;
}

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

export function yesterdayISO(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

export function isValidISODate(value: string): boolean {
  return (
    /^\d{4}-\d{2}-\d{2}$/.test(value) &&
    !Number.isNaN(new Date(value).getTime())
  );
}

export function formatDateLabel(iso: string): string {
  const date = new Date(`${iso}T00:00:00`);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function monthKey(iso: string): string {
  return iso.slice(0, 7); // yyyy-mm
}

export function isSameMonth(
  iso: string,
  reference: Date = new Date(),
): boolean {
  return monthKey(iso) === reference.toISOString().slice(0, 7);
}
