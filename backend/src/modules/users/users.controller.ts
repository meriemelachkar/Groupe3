import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // 🔹 Liste tous les utilisateurs (admin seulement)
  @Get()
  @Roles('admin')
  findAll() {
    return this.usersService.findAll();
  }

  // 🔹 Récupère un utilisateur par ID (admin ou le user lui-même)
  @Get(':id')
  @Roles('admin', 'investisseur', 'promoteur', 'acheteur')
  async findOne(@Param('id') id: string, @Request() req) {
    // Si l'utilisateur n'est pas admin, il ne peut voir que son propre profil
    if (req.user.role !== 'admin' && req.user.userId !== id) {
      return { message: 'Accès non autorisé à ce profil' };
    }
    return this.usersService.findById(id);
  }
}
