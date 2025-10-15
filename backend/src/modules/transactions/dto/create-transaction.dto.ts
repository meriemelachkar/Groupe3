import { IsMongoId, IsNumber, Min } from 'class-validator';

export class CreateTransactionDto {
  @IsMongoId()
  bienId: string;

  @IsNumber()
  @Min(100)
  montant: number;
}
