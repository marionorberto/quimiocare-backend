import { MaxLength } from 'class-validator';

export class UpdatePostCommentDto {
  @MaxLength(500)
  comment: string;
}
