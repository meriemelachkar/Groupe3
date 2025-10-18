import { IsString, IsMongoId, MinLength } from 'class-validator';

export class CreateMessageDto {
  @IsMongoId()
  destinataireId: string;

  @IsString()
  @MinLength(1)
  contenu: string;
}
