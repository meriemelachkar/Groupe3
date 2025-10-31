import { Controller, Post, Body, Request, UseGuards, Get, Delete, Param, Patch } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('reservations')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
  @Roles('acheteur')
  async create(@Body() dto: CreateReservationDto, @Request() req) {
    const userId = req.user?.userId;
    return this.reservationsService.create(dto, userId);
  }

  @Get('me')
  @Roles('acheteur')
  async findMine(@Request() req) {
    const userId = req.user?.userId;
    return this.reservationsService.findByBuyer(userId);
  }

  // Reservations for properties owned by the promoteur
  @Get('for-my-properties')
  @Roles('promoteur')
  async findForOwner(@Request() req) {
    const userId = req.user?.userId;
    return this.reservationsService.findByProprietaire(userId);
  }

  // Reservations for properties owned by the promoteur that are reserved / pending
  @Get('for-my-reserved')
  @Roles('promoteur')
  async findForOwnerReserved(@Request() req) {
    const userId = req.user?.userId;
    const all = await this.reservationsService.findByProprietaire(userId);
    // keep only reservations where property is reserved or reservation is pending/accepted
    const filtered = (all || []).filter((r: any) => {
      const prop = r.propertyId || {};
      const propOwner = String(prop.proprietaireId || '');
      if (propOwner !== String(userId)) return false;
      const resStatus = String(r.status || '');
      const propStatut = String(prop.statut || '');
      return resStatus === 'en_attente' || resStatus === 'accepte' || propStatut === 'réservé';
    });
    return filtered;
  }

  @Delete(':id')
  @Roles('acheteur', 'admin')
  async remove(@Param('id') id: string, @Request() req) {
    const userId = req.user?.userId;
    const userRole = req.user?.role;
    return this.reservationsService.cancel(id, userId, userRole);
  }

  // Promoteur (owner) can update reservation status for their property
  @Patch(':id/status')
  @Roles('promoteur', 'admin')
  async updateStatus(@Param('id') id: string, @Request() req, @Body() body: { status: string }) {
    const userId = req.user?.userId;
    const userRole = req.user?.role;
    return this.reservationsService.updateStatus(id, userId, body.status, userRole);
  }
}
