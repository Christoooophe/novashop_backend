import { CartItem, computeTotal } from './pricing';

export interface Cart {
  items: CartItem[];
  promoCode?: string;
}

export interface Order {
  id?: number;
  items: CartItem[];
  total: number;
}

export interface OrderRepository {
  save(order: Omit<Order, 'id'>): Order;
}

export interface OrderNotifier {
  notifyOwner(order: Order): void;
}

export function createOrder(
  cart: Cart,
  { repo, notifier }: { repo: OrderRepository; notifier: OrderNotifier },
) {
  const totals = computeTotal(cart.items, { promoCode: cart.promoCode });
  const order = repo.save({ items: cart.items, total: totals.total });

  notifier.notifyOwner(order);

  return order;
}
