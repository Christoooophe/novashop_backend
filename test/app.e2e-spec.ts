import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';

describe('NovaShop API (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('GET /api/products returns products', () => {
    return request(app.getHttpServer()).get('/api/products').expect(200).expect(({ body }) => {
      expect(Array.isArray(body)).toBe(true);
    });
  });

  it('GET /api/products/:id returns 404 when missing', () => {
    return request(app.getHttpServer()).get('/api/products/999').expect(404);
  });

  it('POST /api/cart/total computes total', () => {
    return request(app.getHttpServer())
      .post('/api/cart/total')
      .send({ items: [{ price: 10, quantity: 2 }] })
      .expect(200)
      .expect(({ body }) => {
        expect(body.total).toBe(29);
      });
  });

  it('POST /api/cart/total returns 400 on invalid data', () => {
    return request(app.getHttpServer())
      .post('/api/cart/total')
      .send({ items: [{ price: 10, quantity: 0 }] })
      .expect(400);
  });
});
