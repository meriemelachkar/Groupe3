import { Test, TestingModule } from '@nestjs/testing';
import { BiensService } from './biens.service';
import { getModelToken } from '@nestjs/mongoose';
import { BienImmobilier } from './schemas/bien.schema';

describe('BiensService', () => {
  let service: BiensService;

  const mockModel = {
    find: jest.fn().mockResolvedValue([{ _id: 'b1', titre: 'Appartement Tunis' }]),
    create: jest.fn().mockResolvedValue({ _id: 'b1', titre: 'Appartement Tunis' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BiensService,
        { provide: getModelToken(BienImmobilier.name), useValue: mockModel },
      ],
    }).compile();

    service = module.get<BiensService>(BiensService);
  });

  it('✅ BiensService défini', () => expect(service).toBeDefined());
});
