import {
  BadRequestException,
  Injectable,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { products } from './data/products';
import { DbService } from './db.service';
import { CartItem, computeTotal } from './domain/pricing';

export interface CartTotalRequest {
  items?: CartItem[];
  promoCode?: string;
}

@Injectable()
export class AppService {
  constructor(private readonly dbService: DbService) {}

  async getHealth() {
    const time = new Date().toISOString();

    try {
      await this.dbService.ping();

      return {
        status: 'up',
        time,
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Database unavailable';
      throw new ServiceUnavailableException({
        status: 'down',
        error: message,
        time,
      });
    }
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
