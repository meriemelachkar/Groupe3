import { IsString, IsOptional } from 'class-validator';

export class CreateReservationDto {
  @IsString()
  propertyId: string;

  @IsOptional()
  loanSimulation?: any;
}
