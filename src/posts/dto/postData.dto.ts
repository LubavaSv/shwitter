import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  NotContains,
} from 'class-validator';

export class PostDataDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(150)
  text: string;

  @IsString()
  @IsOptional()
  image?: string;

  @IsOptional()
  @IsString({ each: true })
  @NotContains(' ', { each: true })
  hashtags?: string[];
}
