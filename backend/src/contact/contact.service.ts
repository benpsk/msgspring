import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { ContactSubmission } from './contact.types';
import { CreateContactDto } from './dto/create-contact.dto';
import {
  normalizeCompactText,
  normalizeEmail,
  normalizeOptionalMessage,
} from './contact.utils';

@Injectable()
export class ContactService {
  constructor(private readonly databaseService: DatabaseService) {}

  async create(createContactDto: CreateContactDto): Promise<ContactSubmission> {
    const createdRequest = await this.databaseService.createContactRequest({
      full_name: normalizeCompactText(createContactDto.full_name),
      email: normalizeEmail(createContactDto.email),
      country: normalizeCompactText(createContactDto.country),
      message: normalizeOptionalMessage(createContactDto.message),
    });

    return {
      id: createdRequest.id,
      submitted_at: createdRequest.created_at.toISOString(),
    };
  }
}
