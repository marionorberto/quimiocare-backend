import { IsBoolean, IsString } from 'class-validator';

export class CreateDailyDto {
  @IsString({ message: 'O nivel de dor deve ser uma string!' })
  painLevel: string;

  @IsString({ message: 'O efeito collateral deve ser uma string!' })
  collateralEffect: string;

  @IsBoolean({ message: 'Dormiu Bem deve ser enviado' })
  sleepWell: boolean;

  @IsString({ message: 'A nota deve ser uma string!' })
  note: string;

  @IsString({ message: 'O Estado emocional deve ser uma string!' })
  emoccioanlState: string;

  @IsBoolean({ message: 'hidratedToday Bem deve ser enviado' })
  hidratedToday: boolean;

  @IsBoolean({ message: 'feedToday Bem deve ser enviado' })
  feedToday: boolean;

  @IsBoolean({ message: 'exercicesToday Bem deve ser enviado' })
  exercicesToday: boolean;

  @IsString({ message: 'O Nivel de cançaso deve ser uma string!' })
  tiredLevelToday: string;
}
