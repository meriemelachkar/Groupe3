import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Récupère le ConfigService pour afficher les variables d'environnement
  const config = app.get(ConfigService);
  console.log('✅ JWT_SECRET:', config.get('JWT_SECRET'));
  console.log('✅ MONGO_URI:', config.get('MONGO_URI'));

  // ✅ Active CORS pour autoriser ton frontend Vite
  app.enableCors({
    origin: 'http://localhost:5173', // ton frontend
    credentials: true, // utile si tu enverras des cookies plus tard
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  });

  // Démarre le serveur sur le port défini dans .env ou 3000 par défaut
  const port = process.env.PORT || 3000;
  await app.listen(port);

  console.log(`🚀 Application is running on: ${await app.getUrl()}`);
}
bootstrap();
