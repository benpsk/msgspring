import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ContactRequestEntity } from './entities/contact-request.entity';
import { ContactService } from './contact.service';

describe('ContactService', () => {
  let service: ContactService;

  const contactRequestsRepository = {
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContactService,
        {
          provide: getRepositoryToken(ContactRequestEntity),
          useValue: contactRequestsRepository,
        },
      ],
    }).compile();

    service = module.get<ContactService>(ContactService);
    contactRequestsRepository.create.mockReset();
    contactRequestsRepository.save.mockReset();
  });

  it('normalizes and stores contact requests', async () => {
    const preparedRequest = {
      full_name: 'Ada Lovelace',
      email: 'ada@example.com',
      country: 'United Kingdom',
      message: 'Need a walkthrough',
    };
    const savedRecord = {
      ...preparedRequest,
      id: 7,
      created_at: new Date('2026-04-02T01:02:03.000Z'),
    };

    contactRequestsRepository.create.mockReturnValue(preparedRequest);
    contactRequestsRepository.save.mockResolvedValue(savedRecord);

    const result = await service.create({
      full_name: '  Ada   Lovelace  ',
      email: '  ADA@example.com ',
      country: '  United   Kingdom ',
      message: '  Need a walkthrough\r\n',
    });

    expect(contactRequestsRepository.create).toHaveBeenCalledWith(
      preparedRequest,
    );
    expect(contactRequestsRepository.save).toHaveBeenCalledWith(
      preparedRequest,
    );
    expect(result).toEqual({
      id: 7,
      submitted_at: '2026-04-02T01:02:03.000Z',
    });
  });

  it('drops empty optional messages before saving', async () => {
    const preparedRequest = {
      full_name: 'Ada Lovelace',
      email: 'ada@example.com',
      country: 'UK',
      message: null,
    };
    const savedRecord = {
      ...preparedRequest,
      id: 8,
      created_at: new Date('2026-04-02T05:00:00.000Z'),
    };

    contactRequestsRepository.create.mockReturnValue(preparedRequest);
    contactRequestsRepository.save.mockResolvedValue(savedRecord);

    await service.create({
      full_name: 'Ada Lovelace',
      email: 'ada@example.com',
      country: 'UK',
      message: '   ',
    });

    expect(contactRequestsRepository.create).toHaveBeenCalledWith(
      preparedRequest,
    );
    expect(contactRequestsRepository.save).toHaveBeenCalledWith(
      preparedRequest,
    );
  });
});
