import {
  Controller, Post, Get, Patch, Delete,
  Param, Body, UseGuards, Request
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('messages')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MessagesController {
  [x: string]: any;
  findAll: any;
  constructor(private readonly messagesService: MessagesService) {}

  // 📨 Envoyer un message
  @Post()
  async create(@Body() dto: CreateMessageDto, @Request() req) {
    return this.messagesService.create(dto, req.user.userId);
  }

  // 📬 Voir mes messages
  @Get()
  async findByUser(@Request() req) {
    return this.messagesService.findByUser(req.user.userId);
  }

  // 💬 Voir conversation avec un utilisateur
  @Get('conversation/:id')
  async findConversation(@Param('id') id: string, @Request() req) {
    return this.messagesService.findConversation(req.user.userId, id);
  }

  // ✅ Marquer comme lu
  @Patch(':id/lu')
  async markAsRead(@Param('id') id: string, @Request() req) {
    return this.messagesService.markAsRead(id, req.user.userId);
  }

  // ❌ Supprimer un message
  @Delete(':id')
  @Roles('admin', 'investisseur', 'promoteur', 'acheteur')
  async remove(@Param('id') id: string, @Request() req) {
    const isAdmin = req.user.role === 'admin';
    return this.messagesService.remove(id, req.user.userId, isAdmin);
  }
}
