import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateQuestionDto {
  @IsString({ message: 'A questão precisa ser uma string!' })
  @IsNotEmpty({ message: 'A questão  não pode estar vazia!' })
  question: string;
}
