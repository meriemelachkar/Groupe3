import { Test, TestingModule } from '@nestjs/testing';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

describe('DashboardController', () => {
  let controller: DashboardController;

  const mockDashboardService = {
    getPromoteurDashboard: jest.fn().mockResolvedValue({ projets: 2 }),
    getBienDetails: jest.fn().mockResolvedValue({ titre: 'Villa Luxueuse' }),
    getPromoteurProjetsDashboard: jest.fn().mockResolvedValue({ total: 5 }),
    getProjetDetails: jest.fn().mockResolvedValue({ titre: 'Projet X' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DashboardController],
      providers: [
        { provide: DashboardService, useValue: mockDashboardService },
      ],
    }).compile();

    controller = module.get<DashboardController>(DashboardController);
  });

  it(' contrôleur défini', () => {
    expect(controller).toBeDefined();
  });

  it(' doit retourner les données du promoteur', async () => {
    const req = { user: { userId: '123' } };
    const res = await controller.getDashboardPromoteur(req);
    expect(res).toEqual({ projets: 2 });
  });
});
