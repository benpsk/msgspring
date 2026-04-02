import { Controller, Get } from '@nestjs/common';
import { SkipThrottle } from '@nestjs/throttler';
import { ResponseMessage } from './common/api/response-message.decorator';
import { AppService } from './app.service';

@Controller('health')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @SkipThrottle()
  @ResponseMessage('health status fetched successfully.')
  getHealth() {
    return this.appService.getHealth();
  }
}
