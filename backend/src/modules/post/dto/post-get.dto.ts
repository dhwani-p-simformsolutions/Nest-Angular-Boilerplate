// src/posts/dto/GetPostsDto.ts
import { IsOptional, IsNumber, Min } from 'class-validator';

export class GetPostsDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number = 1; // Default page is 1

  @IsOptional()
  @IsNumber()
  @Min(1)
  limit?: number = 10; // Default limit is 10
}
