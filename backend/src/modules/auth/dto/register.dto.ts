import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class RegisterDto {
  @IsString({ message: 'Le nom est requis' })
  nom: string;

  @IsString({ message: 'Le prénom est requis' })
  prenom: string;

  @IsEmail({}, { message: 'Email invalide' })
  email: string;

  @MinLength(6, { message: 'Le mot de passe doit contenir au moins 6 caractères' })
  motDePasse: string;

  @IsString()
  @Transform(({ value }) => value?.toLowerCase())
  @IsOptional()
  role: string = 'acheteur';
}
