import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { configureApp } from '../src/app.setup';
import { ContactService } from '../src/contact/contact.service';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  const contactService = {
    create: jest.fn(),
  };

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(ContactService)
      .useValue(contactService)
      .compile();

    app = moduleFixture.createNestApplication();
    configureApp(app);
    await app.init();
  });

  beforeEach(() => {
    contactService.create.mockReset();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/api/health (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/health')
      .expect(200)
      .expect({
        success: true,
        message: 'health status fetched successfully.',
        data: {
          status: 'ok',
          service: 'messagespring-backend',
        },
        error: null,
      });
  });

  it('/api/contact (POST)', async () => {
    contactService.create.mockResolvedValue({
      id: 42,
      submitted_at: '2026-04-02T00:00:00.000Z',
    });

    await request(app.getHttpServer())
      .post('/api/contact')
      .send({
        full_name: 'Ada Lovelace',
        email: 'ada@example.com',
        country: 'United Kingdom',
        message: 'Please contact me for a walkthrough.',
      })
      .expect(201)
      .expect({
        success: true,
        message: 'contact request submitted successfully.',
        data: {
          id: 42,
          submitted_at: '2026-04-02T00:00:00.000Z',
        },
        error: null,
      });

    expect(contactService.create).toHaveBeenCalledWith({
      full_name: 'Ada Lovelace',
      email: 'ada@example.com',
      country: 'United Kingdom',
      message: 'Please contact me for a walkthrough.',
    });
  });

  it('/api/contact (POST) rejects invalid payloads', async () => {
    const response = await request(app.getHttpServer())
      .post('/api/contact')
      .send({
        full_name: 'A',
        email: 'not-an-email',
        country: '',
        extra: 'unexpected',
      });
    const responseBody = response.body as {
      success: boolean;
      message: string;
      data: null;
      error: Record<string, string>;
    };

    expect(response.status).toBe(400);
    expect(responseBody.success).toBe(false);
    expect(responseBody.message).toBe('Please correct the highlighted fields.');
    expect(responseBody.data).toBeNull();
    expect(responseBody.error).toEqual({
      full_name: 'Full name must be at least 2 characters.',
      email: 'Enter a valid email address.',
      country: 'Country must be at least 2 characters.',
      extra: 'This field is not allowed.',
    });
  });
});
