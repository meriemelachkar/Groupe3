import { Module } from '@nestjs/common';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import jwtConfig from '../../config/jwt.config';
import { ConfigType } from '@nestjs/config';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [jwtConfig.KEY],
      useFactory: (jwtConf: ConfigType<typeof jwtConfig>): JwtModuleOptions => {
        const expires = jwtConf.expiresIn;
        
        // Conversion intelligente du format
        let expiresIn: string | number;
        
        if (!isNaN(Number(expires)) && expires.trim() !== '') {
          // Si c'est un nombre (en secondes), on le convertit
          expiresIn = Number(expires);
        } else {
          // Si c'est déjà un format string ("1h", "2d", etc.), on le garde
          expiresIn = expires as string;
        }
        
        return {
          secret: jwtConf.secret,
          signOptions: {
            expiresIn: expiresIn as any, // Cast to any to satisfy type checker
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}