import {
  Injectable,
  InternalServerErrorException,
  Logger,
  ServiceUnavailableException,
  Optional,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContactRequestEntity } from './entities/contact-request.entity';
import {
  ContactRequestRecord,
  CreateContactRequestRecord,
} from './database.types';

@Injectable()
export class DatabaseService {
  private readonly logger = new Logger(DatabaseService.name);

  constructor(
    @Optional()
    @InjectRepository(ContactRequestEntity)
    private readonly contactRequestsRepository?: Repository<ContactRequestEntity>,
  ) {}

  async createContactRequest(
    input: CreateContactRequestRecord,
  ): Promise<ContactRequestRecord> {
    if (!this.contactRequestsRepository) {
      throw new ServiceUnavailableException(
        'Database connection is not configured.',
      );
    }

    const contactRequest = this.contactRequestsRepository.create({
      full_name: input.full_name,
      email: input.email,
      country: input.country,
      message: input.message ?? null,
    });

    try {
      return await this.contactRequestsRepository.save(contactRequest);
    } catch (error) {
      this.logger.error(
        'Failed to persist contact request',
        error instanceof Error ? error.stack : undefined,
      );
      throw new InternalServerErrorException(
        'Could not save the contact request.',
      );
    }
  }
}
