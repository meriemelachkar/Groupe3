import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  const mockAuthService = {
    login: jest.fn().mockResolvedValue({ token: 'fake-jwt-token' }),
    register: jest.fn().mockResolvedValue({ _id: '1', email: 'new@mail.com' }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('✅ contrôleur défini', () => {
    expect(controller).toBeDefined();
  });

  it('📋 login appelle le service', async () => {
    const res = await controller.login({ email: 'test@mail.com', motDePasse: '123456' });
    expect(res.token).toBe('fake-jwt-token');
  });
});
