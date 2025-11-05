import { Test, TestingModule } from '@nestjs/testing';
import { ProjetsService } from './projets.service';
import { getModelToken } from '@nestjs/mongoose';

describe('ProjetsService', () => {
  let service: ProjetsService;

  const mockProjetModel = {
    find: jest.fn().mockResolvedValue([{ _id: '1', titre: 'Projet test' }]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjetsService,
        { provide: getModelToken('Projet'), useValue: mockProjetModel },
      ],
    }).compile();

    service = module.get<ProjetsService>(ProjetsService);
  });

  it(' ProjetsService défini', () => {
    expect(service).toBeDefined();
  });
});
