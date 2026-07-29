import { createOrder } from './orderService';

describe('createOrder', () => {
  it('calcule, sauvegarde et notifie une fois', () => {
    const repo = { save: jest.fn((o) => ({ id: 1, ...o })) };
    const notifier = { notifyOwner: jest.fn() };

    const order = createOrder(
      { items: [{ price: 100, quantity: 1 }] },
      { repo, notifier },
    );

    expect(order.total).toBeGreaterThan(0);
    expect(repo.save).toHaveBeenCalledTimes(1);
    expect(repo.save).toHaveBeenCalledWith({
      items: [{ price: 100, quantity: 1 }],
      total: 120,
    });
    expect(notifier.notifyOwner).toHaveBeenCalledTimes(1);
    expect(notifier.notifyOwner).toHaveBeenCalledWith(order);
  });
});
