import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContactSubmission } from './contact.types';
import { CreateContactDto } from './dto/create-contact.dto';
import {
  normalizeCompactText,
  normalizeEmail,
  normalizeOptionalMessage,
} from './contact.utils';
import { ContactRequestEntity } from './entities/contact-request.entity';

@Injectable()
export class ContactService {
  constructor(
    @InjectRepository(ContactRequestEntity)
    private readonly contactRequestsRepository: Repository<ContactRequestEntity>,
  ) {}

  async create(createContactDto: CreateContactDto): Promise<ContactSubmission> {
    const preparedRequest = this.contactRequestsRepository.create({
      full_name: normalizeCompactText(createContactDto.full_name),
      email: normalizeEmail(createContactDto.email),
      country: normalizeCompactText(createContactDto.country),
      message: normalizeOptionalMessage(createContactDto.message) ?? null,
    });

    const createdRequest =
      await this.contactRequestsRepository.save(preparedRequest);

    return {
      id: createdRequest.id,
      submitted_at: createdRequest.created_at.toISOString(),
    };
  }
}
