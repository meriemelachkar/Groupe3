import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsController } from './transactions.controller';
import { TransactionsService } from './transactions.service';

describe('TransactionsController', () => {
  let controller: TransactionsController;

  const mockTransactionsService = {
    findAll: jest.fn().mockResolvedValue([{ _id: 't1', montant: 10000 }]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionsController],
      providers: [
        { provide: TransactionsService, useValue: mockTransactionsService },
      ],
    }).compile();

    controller = module.get<TransactionsController>(TransactionsController);
  });

  it('✅ contrôleur défini', () => {
    expect(controller).toBeDefined();
  });

  it('💰 doit retourner toutes les transactions', async () => {
    const res = await controller.findAll();
    expect(res).toEqual([{ _id: 't1', montant: 10000 }]);
  });
});
