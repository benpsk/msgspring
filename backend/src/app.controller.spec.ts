import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();
  });

  describe('getHealth', () => {
    it('should return the service health payload', () => {
      const appController = app.get(AppController);
      expect(appController.getHealth()).toEqual({
        status: 'ok',
        service: 'messagespring-backend',
      });
    });
  });
});
