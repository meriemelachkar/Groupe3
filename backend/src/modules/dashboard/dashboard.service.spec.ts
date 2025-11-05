import { Test, TestingModule } from '@nestjs/testing';
import { DashboardService } from './dashboard.service';
import { getModelToken } from '@nestjs/mongoose';

describe('DashboardService', () => {
  let service: DashboardService;

  const mockModel = {
    countDocuments: jest.fn().mockResolvedValue(5),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardService,
        { provide: getModelToken('BienImmobilier'), useValue: mockModel },
        { provide: getModelToken('Reservation'), useValue: mockModel },
        { provide: getModelToken('User'), useValue: mockModel },
        { provide: getModelToken('Projet'), useValue: mockModel },
        { provide: getModelToken('Investissement'), useValue: mockModel },
      ],
    }).compile();

    service = module.get<DashboardService>(DashboardService);
  });

  it(' DashboardService défini', () => {
    expect(service).toBeDefined();
  });
});
