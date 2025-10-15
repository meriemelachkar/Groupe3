import { IsString, IsNumber, IsEnum, IsOptional } from 'class-validator';

export class CreateBienDto {
  @IsString()
  titre: string;

  @IsString()
  description?: string;

  @IsNumber()
  prix: number;

  @IsEnum(['appartement', 'maison', 'bureau'])
  typeBien: string;

  @IsString()
  adresse: string;

  @IsOptional()
  @IsString()
  projetAssocieId?: string;
}
