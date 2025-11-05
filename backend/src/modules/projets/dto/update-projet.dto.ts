import { IsString, IsOptional, IsEnum, IsNumber, Min, Max } from 'class-validator';

export class UpdateProjetDto {
  @IsOptional() @IsString() titre?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @IsString() imageUrl?: string;
  @IsOptional() @IsEnum(['en_cours', 'financé', 'terminé']) statut?: string;
  @IsOptional() @IsNumber() montantCollecte?: number;
  @IsOptional() @IsNumber() @Min(0) @Max(100) rendement?: number;
  @IsOptional() @IsNumber() @Min(1) duree?: number;
}
