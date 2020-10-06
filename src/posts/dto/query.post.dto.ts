import {
  IsNumber,
  IsOptional,
  IsString,
  Max,
  NotContains,
} from 'class-validator';

export class QueryPostDto {
  @IsString()
  @IsOptional()
  @NotContains(' ')
  hashtag?: string;

  @IsString()
  @IsOptional()
  text?: string;

  @IsString()
  @IsOptional()
  userid?: number;

  @IsNumber()
  @IsOptional()
  page?: number;

  @IsNumber()
  @IsOptional()
  @Max(1000)
  limit?: number;
}
