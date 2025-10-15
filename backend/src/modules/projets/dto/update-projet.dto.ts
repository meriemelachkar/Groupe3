import { IsString, IsOptional, IsEnum, IsNumber } from 'class-validator';

export class UpdateProjetDto {
  @IsOptional() @IsString() titre?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsEnum(['en_cours', 'financé', 'terminé']) statut?: string;
  @IsOptional() @IsNumber() montantCollecte?: number;
}
