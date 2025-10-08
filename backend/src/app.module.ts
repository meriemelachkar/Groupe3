import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TestModule } from './test/test.module';

@Module({
  imports: [
    // 1️⃣ Charger les variables d'environnement globalement
    ConfigModule.forRoot({
      isGlobal: true, // rend disponible partout sans ré-importer
      envFilePath: '.env', // chemin vers ton fichier .env
    }),

    // 2️⃣ Connexion à MongoDB avec l’URL du .env
    MongooseModule.forRoot(process.env.MONGO_URI!),

    TestModule,

    // 3️⃣ Modules de ton app (auth, users, etc.)
  ],
})
export class AppModule {}
