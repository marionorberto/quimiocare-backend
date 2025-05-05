import { IsString } from 'class-validator';

export class UpdateDailyDto {
  @IsString({ message: 'O nivel de dor deve ser uma string!' })
  painLevel: string;

  @IsString({ message: 'O efeito collateral deve ser uma string!' })
  collateralEffect: string;

  sleepWell: boolean;

  @IsString({ message: 'A nota deve ser uma string!' })
  note: string;

  @IsString({ message: 'O Estado emocional deve ser uma string!' })
  emoccioanlState: string;

  hidratedToday: boolean;

  feedToday: boolean;

  exercicesToday: boolean;

  @IsString({ message: 'O Nivel de cançaso deve ser uma string!' })
  tiredLevelToday: string;
}
