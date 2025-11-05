import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InvestissementsService } from './investissements.service';
import { InvestissementsController } from './investissements.controller';
import { Investissement, InvestissementSchema } from './schemas/investissement.schema';
import { Projet, ProjetSchema } from '../projets/schemas/projet.schema'; // pour vérifier le projet

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Investissement.name, schema: InvestissementSchema },
      { name: Projet.name, schema: ProjetSchema },
    ]),
  ],
  controllers: [InvestissementsController],
  providers: [InvestissementsService],
})
export class InvestissementsModule {}
