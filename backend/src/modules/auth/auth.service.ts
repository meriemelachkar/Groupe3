import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { MinioService } from '../minio.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly minioService: MinioService
  ) {}

  async register(dto: RegisterDto, photo?: Express.Multer.File) {
    const existing = await this.usersService.findByEmail(dto.email);
    if (existing) throw new BadRequestException('Cet email est déjà utilisé.');

    let photoUrl: string | undefined;
    if (photo) {
      try {
        photoUrl = await this.minioService.uploadFile(photo, 'avatars');
      } catch (error) {
        console.error('Erreur lors de l\'upload de la photo:', error);
      }
    }

    const hash = await bcrypt.hash(dto.motDePasse, 10);
    const user = await this.usersService.create({
      ...dto,
      motDePasse: hash,
      photoUrl,
    });

    const payload = { sub: user._id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);

    return { token, user };
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Utilisateur introuvable');

    const match = await bcrypt.compare(dto.motDePasse, user.motDePasse);
    if (!match) throw new UnauthorizedException('Mot de passe incorrect');

    const payload = { sub: user._id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);

    return { token, user };
  }
}
