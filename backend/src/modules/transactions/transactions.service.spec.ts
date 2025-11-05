import { Test, TestingModule } from '@nestjs/testing';
import { TransactionsService } from './transactions.service';
import { getModelToken } from '@nestjs/mongoose';
import { Transaction } from './schemas/transaction.schema';

describe('TransactionsService', () => {
  let service: TransactionsService;

  const mockTransactionModel = {
    find: jest.fn().mockResolvedValue([{ _id: 't1', montant: 5000 }]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionsService,
        { provide: getModelToken(Transaction.name), useValue: mockTransactionModel },
        { provide: getModelToken('BienImmobilier'), useValue: {} },
      ],
    }).compile();

    service = module.get<TransactionsService>(TransactionsService);
  });

  it('✅ TransactionsService défini', () => expect(service).toBeDefined());
});
