import { IsString, IsNumber, IsEnum, IsNotEmpty } from 'class-validator';

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
}
