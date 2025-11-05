import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DashboardService } from './dashboard.service';
import { DashboardController } from './dashboard.controller';
import { BienImmobilier, BienImmobilierSchema } from '../biens/schemas/bien.schema';
import { Reservation, ReservationSchema } from '../reservations/schemas/reservation.schema';
import { User, UserSchema } from '../users/schemas/user.schema';
import { Projet, ProjetSchema } from '../projets/schemas/projet.schema';
import { Investissement, InvestissementSchema } from '../investissements/schemas/investissement.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: BienImmobilier.name, schema: BienImmobilierSchema },
      { name: Reservation.name, schema: ReservationSchema },
      { name: User.name, schema: UserSchema },
      { name: Projet.name, schema: ProjetSchema },
      { name: Investissement.name, schema: InvestissementSchema },
    ]),
  ],
  controllers: [DashboardController],
  providers: [DashboardService],
})
export class DashboardModule {}
