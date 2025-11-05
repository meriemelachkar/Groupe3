import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, UseGuards, Request, UseInterceptors, UploadedFile
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
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

  // Projets du promoteur connecté
  @Get('me')
  @Roles('promoteur')
  async findMine(@Request() req) {
    const promoteurId = req.user.userId;
    return this.projetsService.findByPromoteur(promoteurId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.projetsService.findOne(id);
  }

  @Post()
  @Roles('promoteur')
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() dto: CreateProjetDto,
    @Request() req,
    @UploadedFile() image?: Express.Multer.File
  ) {
    // Conversion explicite des champs numériques
    const parsedDto = {
      ...dto,
      montantTotal: Number(dto.montantTotal),
      rendement: Number(dto.rendement),
      duree: Number(dto.duree)
    };
    
    const promoteurId = req.user.userId;
    return this.projetsService.create(parsedDto, promoteurId, image);
  }

  @Patch(':id')
  @Roles('promoteur', 'admin')
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateProjetDto,
    @UploadedFile() image?: Express.Multer.File
  ) {
    return this.projetsService.update(id, dto, image);
  }

  @Delete(':id')
  @Roles('admin')
  async remove(@Param('id') id: string) {
    return this.projetsService.remove(id);
  }
}
