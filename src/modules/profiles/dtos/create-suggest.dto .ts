import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSuggestYTDto {
  @IsString({ message: 'link deve ser um string' })
  @IsNotEmpty({ message: 'link não pode estar vazio' })
  suggestion: string;
}
