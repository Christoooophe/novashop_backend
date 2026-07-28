import { computeTotal, shipping, subtotal } from './pricing';

describe('subtotal', () => {
  it('returns 0 for an empty cart', () => {
    expect(subtotal([])).toBe(0);
  });

  it('sums price times quantity', () => {
    expect(
      subtotal([
        { price: 10, quantity: 2 },
        { price: 5, quantity: 1 },
      ]),
    ).toBe(25);
  });

  it('throws when quantity is invalid', () => {
    expect(() => subtotal([{ price: 10, quantity: 0 }])).toThrow();
  });

  it('throws when quantity is negative', () => {
    expect(() => subtotal([{ price: 10, quantity: -1 }])).toThrow();
  });

  it('throws when price is negative', () => {
    expect(() => subtotal([{ price: -1, quantity: 1 }])).toThrow();
  });
});

describe('shipping', () => {
  it('is free from 50', () => {
    expect(shipping(50)).toBe(0);
  });

  it('is 5 below 50', () => {
    expect(shipping(49.99)).toBe(5);
  });

  it('is 0 for an empty cart', () => {
    expect(shipping(0)).toBe(0);
  });
});

describe('computeTotal', () => {
  it('computes nominal total', () => {
    expect(computeTotal([{ price: 10, quantity: 2 }])).toEqual({
      subtotal: 20,
      discount: 0,
      vat: 4,
      shipping: 5,
      total: 29,
    });
  });

  it('applies tier discount above 100', () => {
    const result = computeTotal([{ price: 200, quantity: 1 }]);

    expect(result.discount).toBeCloseTo(10, 2);
    expect(result.shipping).toBe(0);
  });

  it('applies valid promo code', () => {
    const result = computeTotal([{ price: 100, quantity: 1 }], {
      promoCode: 'BIENVENUE10',
    });

    expect(result.discount).toBeCloseTo(10, 2);
  });

  it('computes 20 percent VAT from taxable amount', () => {
    const result = computeTotal([{ price: 100, quantity: 1 }]);

    expect(result.vat).toBe(20);
  });

  it('returns 0 total for an empty cart', () => {
    expect(computeTotal([]).total).toBe(0);
  });

  it('never returns a negative total', () => {
    const result = computeTotal([{ price: 100, quantity: 1 }], {
      vatRate: -10,
    });

    expect(result.total).toBe(0);
  });

  it('throws on invalid promo code', () => {
    expect(() =>
      computeTotal([{ price: 10, quantity: 1 }], { promoCode: 'XXX' }),
    ).toThrow();
  });
});
