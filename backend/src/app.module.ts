import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,         // ✅ rend ConfigModule accessible partout
      envFilePath: '.env',    // ✅ charge ton .env à la racine
    }),

    MongooseModule.forRoot(process.env.MONGO_URI ?? (() => { throw new Error('MONGO_URI is not defined'); })()),

    UsersModule,
    AuthModule,
  ],
})
export class AppModule {}
