import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUsersService = {
    findAll: jest.fn().mockResolvedValue([{ _id: '1', nom: 'Kaouthar' }]),
    findById: jest.fn().mockResolvedValue({ _id: '1', nom: 'Kaouthar' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: mockUsersService },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  it(' contrôleur défini', () => {
    expect(controller).toBeDefined();
  });

  it(' doit retourner tous les utilisateurs', async () => {
    const result = await controller.findAll();
    expect(service.findAll).toHaveBeenCalled();
    expect(result).toEqual([{ _id: '1', nom: 'Kaouthar' }]);
  });

  it(' doit retourner un utilisateur par ID (admin)', async () => {
    const mockReq = { user: { role: 'admin', userId: '1' } };
    const result = await controller.findOne('1', mockReq);
    expect(service.findById).toHaveBeenCalledWith('1');
    expect(result).toEqual({ _id: '1', nom: 'Kaouthar' });
  });

  it(' doit refuser l’accès si user ≠ admin et ≠ lui-même', async () => {
    const mockReq = { user: { role: 'investisseur', userId: '2' } };
    const result = await controller.findOne('1', mockReq);
    expect(result).toEqual({ message: 'Accès non autorisé à ce profil' });
  });
});
