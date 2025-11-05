import { Test, TestingModule } from '@nestjs/testing';
import { ProjetsController } from './projets.controller';
import { ProjetsService } from './projets.service';

describe('ProjetsController', () => {
  let controller: ProjetsController;

  const mockProjetsService = {
    findAll: jest.fn().mockResolvedValue([{ _id: '1', titre: 'Projet Test' }]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProjetsController],
      providers: [{ provide: ProjetsService, useValue: mockProjetsService }],
    }).compile();

    controller = module.get<ProjetsController>(ProjetsController);
  });

  it(' défini', () => {
    expect(controller).toBeDefined();
  });

  it(' doit retourner la liste des projets', async () => {
    const res = await controller.findAll();
    expect(res).toEqual([{ _id: '1', titre: 'Projet Test' }]);
  });
});
