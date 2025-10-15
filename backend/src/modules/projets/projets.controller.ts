import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, UseGuards, Request
} from '@nestjs/common';
import { ProjetsService } from './projets.service';
import { CreateProjetDto } from './dto/create-projet.dto';
import { UpdateProjetDto } from './dto/update-projet.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('projets')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProjetsController {
  constructor(private readonly projetsService: ProjetsService) {}

  @Get()
  async findAll() {
    return this.projetsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.projetsService.findOne(id);
  }

  @Post()
  @Roles('promoteur')
  async create(@Body() dto: CreateProjetDto, @Request() req) {
    const promoteurId = req.user.userId; // récupéré depuis le token JWT
    return this.projetsService.create(dto, promoteurId);
  }

  @Patch(':id')
  @Roles('promoteur', 'admin')
  async update(@Param('id') id: string, @Body() dto: UpdateProjetDto) {
    return this.projetsService.update(id, dto);
  }

  @Delete(':id')
  @Roles('admin')
  async remove(@Param('id') id: string) {
    return this.projetsService.remove(id);
  }
}
