import { IsString } from 'class-validator';
import { ApiProperty } from "@nestjs/swagger";

export class CreateArticleDto {
  @ApiProperty()
  @IsString()
  readonly title: string;
  @ApiProperty()
  @IsString()
  readonly body: string;
}
