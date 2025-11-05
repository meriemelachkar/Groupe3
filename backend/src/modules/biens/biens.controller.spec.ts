import { Test, TestingModule } from '@nestjs/testing';
import { BiensController } from './biens.controller';
import { BiensService } from './biens.service';

describe('BiensController', () => {
  let controller: BiensController;

  const mockBiensService = {
    findAll: jest.fn().mockResolvedValue([{ _id: 'b1', titre: 'Appartement Tunis' }]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BiensController],
      providers: [{ provide: BiensService, useValue: mockBiensService }],
    }).compile();

    controller = module.get<BiensController>(BiensController);
  });

  it(' devrait être défini', () => {
    expect(controller).toBeDefined();
  });

  it(' doit retourner tous les biens', async () => {
    const res = await controller.findAll();
    expect(res).toEqual([{ _id: 'b1', titre: 'Appartement Tunis' }]);
  });
});
