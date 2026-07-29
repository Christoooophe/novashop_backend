export interface CartItem {
  price: number;
  quantity: number;
}

export interface ComputeTotalOptions {
  promoCode?: string;
  vatRate?: number;
}

export const VAT_RATE = 0.2;

const PROMOS: Record<string, number> = {
  BIENVENUE10: 0.1,
  MEGA50: 0.5,
};

function assertItem(item: CartItem) {
  if (!item) {
    throw new Error('Article invalide');
  }

  if (item.price < 0) {
    throw new Error('Prix negatif interdit');
  }

  if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
    throw new Error('Quantite invalide');
  }
}

function round2(value: number) {
  return Math.round(value * 100) / 100;
}

export function subtotal(items: CartItem[] | undefined) {
  if (!Array.isArray(items)) {
    throw new Error('items doit etre un tableau');
  }

  return items.reduce((sum, item) => {
    assertItem(item);
    return sum + item.price * item.quantity;
  }, 0);
}

export function tierDiscount(subtotalValue: number) {
  return subtotalValue > 100 ? subtotalValue * 0.05 : 0;
}

export function promoDiscount(subtotalValue: number, code?: string) {
  if (!code) {
    return 0;
  }

  const rate = PROMOS[code];

  if (rate === undefined) {
    throw new Error('Code promo invalide');
  }

  return subtotalValue * rate;
}

export function shipping(subtotalValue: number) {
  if (subtotalValue <= 0) {
    return 0;
  }

  return subtotalValue >= 50 ? 0 : 5;
}

export function computeTotal(items: CartItem[] | undefined, options: ComputeTotalOptions = {}) {
  const subtotalValue = subtotal(items);
  const discount = round2(tierDiscount(subtotalValue) + promoDiscount(subtotalValue, options.promoCode));
  const discountLimit = 0.3 * subtotalValue;
  const discountFinal = round2(Math.min(discount, discountLimit));
  const taxable = Math.max(0, subtotalValue - discountFinal);
  const vat = round2(taxable * (options.vatRate ?? VAT_RATE));
  const shippingValue = shipping(subtotalValue);
  const total = Math.max(0, round2(taxable + vat + shippingValue));

  return {
    subtotal: round2(subtotalValue),
    discount: discountFinal,
    vat,
    shipping: shippingValue,
    total,
  };
}
