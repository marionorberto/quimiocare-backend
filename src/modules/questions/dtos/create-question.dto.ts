import { IsNotEmpty } from 'class-validator';

export class CreateQuestionDto {
  @IsNotEmpty({ message: 'A questão  não pode estar vazia!' })
  question: string;
}
