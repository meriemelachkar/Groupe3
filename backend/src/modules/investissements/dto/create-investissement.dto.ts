import { IsNumber, IsMongoId, Min } from 'class-validator';

export class CreateInvestissementDto {
  @IsMongoId()
  projetId: string;

  @IsNumber()
  @Min(100) // ex : minimum 100€
  montantInvesti: number;
}
