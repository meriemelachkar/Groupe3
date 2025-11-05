import { Controller, Post, Get, Body, UseGuards, Request } from '@nestjs/common';
import { InvestissementsService } from './investissements.service';
import { CreateInvestissementDto } from './dto/create-investissement.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('investissements')
@UseGuards(JwtAuthGuard, RolesGuard)
export class InvestissementsController {
  constructor(private readonly investissementsService: InvestissementsService) {}

  // 🔹 Investir dans un projet (investisseur uniquement)
  @Post()
  @Roles('investisseur')
  async create(@Body() dto: CreateInvestissementDto, @Request() req) {
    const investisseurId = req.user.userId;
    return this.investissementsService.create(dto, investisseurId);
  }

  // 🔹 Voir mes investissements
  @Get('me')
  @Roles('investisseur')
  async findMyInvestissements(@Request() req) {
    return this.investissementsService.findByUser(req.user.userId);
  }

  // 🔹 Voir tous les investissements (admin)
  @Get()
  @Roles('admin')
  async findAll() {
    return this.investissementsService.findAll();
  }
}
