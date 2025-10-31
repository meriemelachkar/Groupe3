import { IsString, IsNumber, IsEnum, IsNotEmpty, Min, Max } from 'class-validator';

export class CreateProjetDto {
  @IsString() @IsNotEmpty()
  titre: string;

  @IsString()
  description: string;

  @IsEnum(['construction', 'rénovation'])
  typeProjet: string;

  @IsNumber()
  montantTotal: number;

  @IsString()
  localisation: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  rendement: number;

  @IsNumber()
  @Min(1)
  duree: number;
}
