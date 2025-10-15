import { IsString, IsNumber, IsEnum, IsOptional } from 'class-validator';

export class UpdateBienDto {
  @IsOptional() @IsString() titre?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsNumber() prix?: number;
  @IsOptional() @IsEnum(['disponible', 'réservé', 'vendu']) statut?: string;
}
