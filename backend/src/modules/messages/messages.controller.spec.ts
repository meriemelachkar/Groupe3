import { Test, TestingModule } from '@nestjs/testing';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';

describe('MessagesController', () => {
  let controller: MessagesController;

  const mockMessagesService = {
    findByUser: jest.fn().mockResolvedValue([
      { _id: 'm1', contenu: 'Salut !', expediteurId: '1', destinataireId: '2' },
    ]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MessagesController],
      providers: [
        { provide: MessagesService, useValue: mockMessagesService },
      ],
    }).compile();

    controller = module.get<MessagesController>(MessagesController);
  });

  it(' contrôleur défini', () => {
    expect(controller).toBeDefined();
  });

  it(' doit retourner les messages de l’utilisateur connecté', async () => {
    const req = { user: { userId: '1' } };
    const res = await controller.findByUser(req);
    expect(mockMessagesService.findByUser).toHaveBeenCalledWith('1');
    expect(res).toEqual([
      { _id: 'm1', contenu: 'Salut !', expediteurId: '1', destinataireId: '2' },
    ]);
  });
});
