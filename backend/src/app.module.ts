import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ProjetsModule } from './modules/projets/projets.module';
import { InvestissementsModule } from './modules/investissements/investissements.module';
import { TransactionsModule } from './modules/transactions/transactions.module';
import { BiensModule } from './modules/biens/biens.module';
import { MessagesModule } from './modules/messages/messages.module';
import { AdminModule } from './modules/admin/admin.module';
import { ReservationsModule } from './modules/reservations/reservations.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import jwtConfig from './config/jwt.config';
import databaseConfig from './config/database.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [jwtConfig, databaseConfig], // 👈 charge tes fichiers config
    }),

    MongooseModule.forRootAsync({
      inject: [databaseConfig.KEY],
      useFactory: (dbConfig: any) => ({
        uri: dbConfig.uri,
      }),
    }),

    UsersModule,
    AuthModule,
    ProjetsModule,
    InvestissementsModule,
    TransactionsModule,
  BiensModule,
  ReservationsModule,
  MessagesModule,
    AdminModule,
    DashboardModule,
  ],
})
export class AppModule {}
