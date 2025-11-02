import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../app.module';

describe('App E2E', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('🚀 devrait démarrer', () => {
    expect(app).toBeDefined();
  });

  it('/unknown (GET) -> 404', () => {
    return request(app.getHttpServer()).get('/unknown').expect(404);
  });

  afterAll(async () => {
    await app.close();
  });
});
