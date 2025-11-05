import { Test, TestingModule } from '@nestjs/testing';
import { TestController } from './test.controller';
import { TestService } from './test.service';

describe('TestController', () => {
  let controller: TestController;

  const mockTestService = {
    getHello: jest.fn().mockReturnValue('Hello World!'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TestController],
      providers: [{ provide: TestService, useValue: mockTestService }],
    }).compile();

    controller = module.get<TestController>(TestController);
  });

  it(' TestController défini', () => {
    expect(controller).toBeDefined();
  });

  it(' doit retourner le message', () => {
    expect(controller.getHello()).toBe('Hello World!');
  });
});
