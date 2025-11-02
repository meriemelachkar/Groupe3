import { Test, TestingModule } from '@nestjs/testing';
import { InvestissementsController } from './investissements.controller';
import { InvestissementsService } from './investissements.service';

describe('InvestissementsController', () => {
  let controller: InvestissementsController;

  const mockInvestissementsService = {
    findAll: jest.fn().mockResolvedValue([{ _id: 'i1', montant: 2000 }]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InvestissementsController],
      providers: [
        { provide: InvestissementsService, useValue: mockInvestissementsService },
      ],
    }).compile();

    controller = module.get<InvestissementsController>(InvestissementsController);
  });

  it('✅ contrôleur défini', () => {
    expect(controller).toBeDefined();
  });

  it('💰 doit retourner tous les investissements', async () => {
    const res = await controller.findAll();
    expect(res).toEqual([{ _id: 'i1', montant: 2000 }]);
  });
});
