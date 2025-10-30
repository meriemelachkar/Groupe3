import { Controller, Post, Body, Request, UseGuards, Get, Delete, Param } from '@nestjs/common';
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

  @Delete(':id')
  @Roles('acheteur', 'admin')
  async remove(@Param('id') id: string, @Request() req) {
    const userId = req.user?.userId;
    const userRole = req.user?.role;
    return this.reservationsService.cancel(id, userId, userRole);
  }
}
