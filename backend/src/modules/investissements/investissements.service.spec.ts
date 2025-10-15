import { Test, TestingModule } from '@nestjs/testing';
import { InvestissementsService } from './investissements.service';

describe('InvestissementsService', () => {
  let service: InvestissementsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InvestissementsService],
    }).compile();

    service = module.get<InvestissementsService>(InvestissementsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
