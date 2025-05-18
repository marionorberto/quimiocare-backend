import { IsString, MinLength } from 'class-validator';

export class UpdateRepliesDto {
  @MinLength(3, { message: 'A resposta precisa no mínimo 3 caracteres' })
  @IsString({ message: 'A nota não pode ser nula!' })
  reply: string;

  @IsString({ message: 'A questão não pode ser nula!' })
  question: string;
}
