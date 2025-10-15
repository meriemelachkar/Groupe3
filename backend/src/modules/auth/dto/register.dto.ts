import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsString() nom: string;
  @IsString() prenom: string;
  @IsEmail() email: string;
  @MinLength(6) motDePasse: string;
  @IsString() role?: string;
}
