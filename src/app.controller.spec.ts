import { BadRequestException, NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DbService } from './db.service';

describe('AppController', () => {
  let appController: AppController;
  let dbService: { ping: jest.Mock };

  beforeEach(async () => {
    dbService = {
      ping: jest.fn().mockResolvedValue(undefined),
    };

    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: DbService,
          useValue: dbService,
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  it('returns health status', async () => {
    await expect(appController.getHealth()).resolves.toMatchObject({
      status: 'up',
    });
  });

  it('returns service unavailable when db is down', async () => {
    dbService.ping.mockRejectedValueOnce(new Error('connect ECONNREFUSED'));

    await expect(appController.getHealth()).rejects.toThrow(ServiceUnavailableException);
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
