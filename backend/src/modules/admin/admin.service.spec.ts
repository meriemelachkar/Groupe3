import { Test, TestingModule } from '@nestjs/testing';
import { AdminService } from './admin.service';
import { getModelToken } from '@nestjs/mongoose';

describe('AdminService', () => {
  let service: AdminService;

  const mockModel = {
    find: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    populate: jest.fn().mockReturnThis(),
    sort: jest.fn().mockResolvedValue([]),
    countDocuments: jest.fn().mockResolvedValue(5),
    aggregate: jest.fn().mockResolvedValue([{ total: 10000 }]),
    findByIdAndDelete: jest.fn().mockResolvedValue({}),
    findByIdAndUpdate: jest.fn().mockResolvedValue({}),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminService,
        { provide: getModelToken('User'), useValue: mockModel },
        { provide: getModelToken('Projet'), useValue: mockModel },
        { provide: getModelToken('Investissement'), useValue: mockModel },
        { provide: getModelToken('Transaction'), useValue: mockModel },
        { provide: getModelToken('Message'), useValue: mockModel },
      ],
    }).compile();

    service = module.get<AdminService>(AdminService);
  });

  it('✅ Service défini', () => {
    expect(service).toBeDefined();
  });

  it('📊 Devrait retourner un tableau vide pour les messages', async () => {
    const result = await service.getAllMessages();
    expect(result).toEqual([]);
  });

  it('📈 Devrait retourner des statistiques du tableau de bord', async () => {
    const result = await service.getDashboard();
    expect(result).toHaveProperty('utilisateurs');
    expect(result).toHaveProperty('projets');
    expect(result).toHaveProperty('investissements');
    expect(result).toHaveProperty('transactions');
    expect(result).toHaveProperty('messages');
  });
});
