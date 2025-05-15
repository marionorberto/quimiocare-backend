import { IsNotEmpty } from 'class-validator';

export class CreateReportDto {
  @IsNotEmpty({ message: 'data de nascimento não pode estar vazia' })
  date: Date;
}
