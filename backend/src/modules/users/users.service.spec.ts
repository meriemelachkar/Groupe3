import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  //  Création d’un mock de service
  const mockUsersService = {
    findAll: jest.fn().mockResolvedValue([{ _id: '1', nom: 'Kaouthar' }]),
    findById: jest.fn().mockResolvedValue({ _id: '1', nom: 'Kaouthar' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('contrôleur défini', () => {
    expect(controller).toBeDefined();
  });

  it('doit retourner tous les utilisateurs', async () => {
    const result = await controller.findAll();
    expect(usersService.findAll).toHaveBeenCalled();
    expect(result).toEqual([{ _id: '1', nom: 'Kaouthar' }]);
  });

  it('doit retourner un utilisateur par ID', async () => {
    const result = await controller.findOne('1', { user: { role: 'admin', userId: '1' } });
    expect(usersService.findById).toHaveBeenCalledWith('1');
    expect(result).toEqual({ _id: '1', nom: 'Kaouthar' });
  });
});
