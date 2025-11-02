import { IsString, IsNumber, IsEnum, IsNotEmpty, Min, Max, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateProjetDto {
  @IsString()
  @IsNotEmpty()
  titre: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(['construction', 'rénovation'])
  typeProjet: string;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  montantTotal: number;

  @IsString()
  @IsNotEmpty()
  localisation: string;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  @Min(0)
  @Max(100)
  rendement: number;

  @IsNumber()
  @Transform(({ value }) => Number(value))
  @Min(1)
  duree: number;

  @IsString()
  @IsOptional()
  imageUrl?: string;
}
