import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ProjetsModule } from './modules/projets/projets.module';
import { InvestissementsModule } from './modules/investissements/investissements.module';
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
  ],
})
export class AppModule {}
