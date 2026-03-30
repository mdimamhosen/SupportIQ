import { IsNotEmpty, IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateChatDto {
  @IsNotEmpty()
  @IsString()
  message: string;

  @IsOptional()
  @IsNumber()
  contextId?: number;
}
