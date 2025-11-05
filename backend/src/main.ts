import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { AllExceptionsFilter } from './common/filters/all-exceptions.filter';
import { LoggingInterceptor } from './common/interceptors/logging.interceptor';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 🔧 Configuration du service d'environnement
  const config = app.get(ConfigService);
  const port = config.get('PORT') || 3000;

  console.log('✅ JWT_SECRET:', config.get('JWT_SECRET'));
  console.log('✅ MONGO_URI:', config.get('MONGO_URI'));

  // 🌐 Active CORS (Frontend Vite ou autre)
  app.enableCors({
    origin: 'http://localhost:5173', // ou ['http://localhost:5173', 'https://monapp.com']
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  });

  // ✅ Validation globale (vérifie automatiquement les DTOs)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // ignore les champs non définis dans le DTO
      forbidNonWhitelisted: true, // renvoie une erreur si un champ non autorisé est envoyé
      transform: true, // transforme les types automatiquement (string → number)
    }),
  );

  // ✅ Gestion globale des exceptions
  app.useGlobalFilters(new AllExceptionsFilter());

  // ✅ Intercepteur de logging
  app.useGlobalInterceptors(new LoggingInterceptor());

  // 📘 Swagger (Documentation API)
  const swaggerConfig = new DocumentBuilder()
    .setTitle('BuildWealth API')
    .setDescription('Documentation de l’API backend BuildWealth')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api/docs', app, document);

  // 🚀 Démarrage du serveur
  await app.listen(port);
  console.log(`🚀 Application running on: ${await app.getUrl()}`);
}
bootstrap();
