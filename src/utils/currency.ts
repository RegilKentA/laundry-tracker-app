// Formats a number as Philippine Peso.
// Change the symbol below if you use a different currency.
const CURRENCY_SYMBOL = '₱';

export function formatCurrency(amount: number): string {
  const safe = isNaN(amount) ? 0 : amount;
  return `${CURRENCY_SYMBOL}${safe.toFixed(2)}`;
}
