import {
  Controller, Get, Post, Patch, Delete, Param, Body, Request, UseGuards
} from '@nestjs/common';
import { BiensService } from './biens.service';
import { CreateBienDto } from './dto/create-bien.dto';
import { UpdateBienDto } from './dto/update-bien.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('biens')
@UseGuards(JwtAuthGuard, RolesGuard)
export class BiensController {
  constructor(private readonly biensService: BiensService) {}

  // 📄 Tous les biens (public)
  @Get()
  async findAll() {
    return this.biensService.findAll();
  }

  // 🔍 Détails d’un bien
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.biensService.findById(id);
  }

  // 🏗️ Créer un bien (promoteur uniquement)
  @Post()
  @Roles('promoteur')
  async create(@Body() dto: CreateBienDto, @Request() req) {
    return this.biensService.create(dto, req.user.userId);
  }

  // ✏️ Modifier un bien (promoteur ou admin)
  @Patch(':id')
  @Roles('promoteur', 'admin')
  async update(@Param('id') id: string, @Body() dto: UpdateBienDto) {
    return this.biensService.update(id, dto);
  }

  // ❌ Supprimer un bien (admin)
  @Delete(':id')
  @Roles('admin')
  async remove(@Param('id') id: string) {
    return this.biensService.remove(id);
  }
}
