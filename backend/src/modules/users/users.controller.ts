import { Controller, Get, Post, Param, UseGuards, Request, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
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

  @Post(':id/photo')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('photo'))
  async uploadProfilePicture(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Request() req,
  ) {
    if (req.user.userId !== id) {
      return { message: 'Vous ne pouvez pas modifier la photo d\'un autre utilisateur' };
    }
    return this.usersService.updateProfilePicture(id, file);
  }
}
