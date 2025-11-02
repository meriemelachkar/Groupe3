import { Test, TestingModule } from '@nestjs/testing';
import { InvestissementsService } from './investissements.service';
import { getModelToken } from '@nestjs/mongoose';

describe('InvestissementsService', () => {
  let service: InvestissementsService;

  const mockInvestissementModel = {
    find: jest.fn().mockResolvedValue([{ montant: 1000 }]),
  };
  const mockProjetModel = {
    findById: jest.fn().mockResolvedValue({ _id: 'p1', titre: 'Projet test' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InvestissementsService,
        { provide: getModelToken('Investissement'), useValue: mockInvestissementModel },
        { provide: getModelToken('Projet'), useValue: mockProjetModel },
      ],
    }).compile();

    service = module.get<InvestissementsService>(InvestissementsService);
  });

  it('✅ InvestissementsService défini', () => {
    expect(service).toBeDefined();
  });
});
