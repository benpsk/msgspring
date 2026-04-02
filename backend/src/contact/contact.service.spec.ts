import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseService } from '../database/database.service';
import { ContactService } from './contact.service';

describe('ContactService', () => {
  let service: ContactService;

  const databaseService = {
    createContactRequest: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContactService,
        {
          provide: DatabaseService,
          useValue: databaseService,
        },
      ],
    }).compile();

    service = module.get(ContactService);
    databaseService.createContactRequest.mockReset();
  });

  it('normalizes and stores contact requests', async () => {
    databaseService.createContactRequest.mockResolvedValue({
      id: 7,
      full_name: 'Ada Lovelace',
      email: 'ada@example.com',
      country: 'United Kingdom',
      message: 'Need a walkthrough',
      created_at: new Date('2026-04-02T01:02:03.000Z'),
    });

    const result = await service.create({
      full_name: '  Ada   Lovelace  ',
      email: '  ADA@example.com ',
      country: '  United   Kingdom ',
      message: '  Need a walkthrough\r\n',
    });

    expect(databaseService.createContactRequest).toHaveBeenCalledWith({
      full_name: 'Ada Lovelace',
      email: 'ada@example.com',
      country: 'United Kingdom',
      message: 'Need a walkthrough',
    });
    expect(result).toEqual({
      id: 7,
      submitted_at: '2026-04-02T01:02:03.000Z',
    });
  });

  it('drops empty optional messages before saving', async () => {
    databaseService.createContactRequest.mockResolvedValue({
      id: 8,
      full_name: 'Ada Lovelace',
      email: 'ada@example.com',
      country: 'UK',
      message: null,
      created_at: new Date('2026-04-02T05:00:00.000Z'),
    });

    await service.create({
      full_name: 'Ada Lovelace',
      email: 'ada@example.com',
      country: 'UK',
      message: '   ',
    });

    expect(databaseService.createContactRequest).toHaveBeenCalledWith({
      full_name: 'Ada Lovelace',
      email: 'ada@example.com',
      country: 'UK',
      message: undefined,
    });
  });
});
