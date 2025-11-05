import { Test, TestingModule } from '@nestjs/testing';
import { MessagesService } from './messages.service';
import { getModelToken } from '@nestjs/mongoose';
import { Message } from './schemas/message.schema';

describe('MessagesService', () => {
  let service: MessagesService;

  const mockModel = {
    find: jest.fn().mockResolvedValue([{ _id: 'm1', contenu: 'Bonjour !' }]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MessagesService,
        { provide: getModelToken(Message.name), useValue: mockModel },
      ],
    }).compile();

    service = module.get<MessagesService>(MessagesService);
  });

  it(' MessagesService défini', () => expect(service).toBeDefined());
});
