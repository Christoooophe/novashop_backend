import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { products } from './data/products';
import { CartItem, computeTotal } from './domain/pricing';

export interface CartTotalRequest {
  items?: CartItem[];
  promoCode?: string;
}

@Injectable()
export class AppService {
  getHealth() {
    return { status: 'ok' };
  }

  getProducts() {
    return products;
  }

  getProduct(id: number) {
    const product = products.find((item) => item.id === id);

    if (!product) {
      throw new NotFoundException('Produit introuvable');
    }

    return product;
  }

  getCartTotal(body: CartTotalRequest = {}) {
    try {
      return computeTotal(body.items, { promoCode: body.promoCode });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Requete invalide';
      throw new BadRequestException(message);
    }
  }
}
