import { IsString, IsNumber, IsEnum, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateBienDto {
  @IsOptional() @IsString() titre?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsNumber() prix?: number;
  @IsOptional() @IsEnum(['disponible', 'réservé', 'vendu']) statut?: string;
  @IsOptional() @IsString() imageUrl?: string;
}
