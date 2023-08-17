import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class PostUpdateDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  public description: string;
}
