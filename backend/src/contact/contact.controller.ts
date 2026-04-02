import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { ResponseMessage } from '../common/api/response-message.decorator';
import { ContactService } from './contact.service';
import { CreateContactDto } from './dto/create-contact.dto';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ResponseMessage('contact request submitted successfully.')
  @Throttle({
    default: {
      limit: 5,
      ttl: 60000,
    },
  })
  async create(@Body() createContactDto: CreateContactDto) {
    return this.contactService.create(createContactDto);
  }
}
