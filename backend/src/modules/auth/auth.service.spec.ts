import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

jest.mock('bcrypt', () => ({
  compare: jest.fn().mockResolvedValue(true),
  hash: jest.fn().mockResolvedValue('hashed-password'),
}));

describe('AuthService', () => {
  let service: AuthService;

  const mockUsersService = {
    findByEmail: jest.fn().mockResolvedValue({
      _id: '1',
      email: 'test@test.com',
      motDePasse: 'hashed-password',
      role: 'user',
    }),
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mock-token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: mockUsersService },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('✅ AuthService défini', () => {
    expect(service).toBeDefined();
  });

  it('🔐 login renvoie un token', async () => {
    const dto = { email: 'test@test.com', motDePasse: '123456' };
    const result = await service.login(dto);
     expect(result).toHaveProperty('token', 'mock-token');
     expect(result).toHaveProperty('user');
  });
});
