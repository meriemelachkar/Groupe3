import { Test, TestingModule } from '@nestjs/testing';
import { InvestissementsController } from './investissements.controller';

describe('InvestissementsController', () => {
  let controller: InvestissementsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [InvestissementsController],
    }).compile();

    controller = module.get<InvestissementsController>(InvestissementsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
