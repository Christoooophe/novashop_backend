import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  it('returns health status', () => {
    expect(appController.getHealth()).toEqual({ status: 'ok' });
  });

  it('returns products', () => {
    expect(Array.isArray(appController.getProducts())).toBe(true);
  });

  it('throws when product is not found', () => {
    expect(() => appController.getProduct(999)).toThrow(NotFoundException);
  });

  it('computes cart total', () => {
    expect(appController.getCartTotal({ items: [{ price: 10, quantity: 2 }] })).toEqual({
      subtotal: 20,
      discount: 0,
      vat: 4,
      shipping: 5,
      total: 29,
    });
  });

  it('throws on invalid cart item', () => {
    expect(() => appController.getCartTotal({ items: [{ price: 10, quantity: 0 }] })).toThrow(
      BadRequestException,
    );
  });
});
