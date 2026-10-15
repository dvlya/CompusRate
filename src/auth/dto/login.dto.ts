import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length, Matches } from 'class-validator';

// DTO qui valide la requête de login.
export class LoginDto {
  @ApiProperty({
    example: 'dalia',
    minLength: 3,
    maxLength: 50,
  })
  @IsString()
  @Length(3, 50)
  @Matches(/^[a-zA-Z0-9_-]+$/, {
    message: 'username can only contain letters, numbers, underscores and hyphens',
  })
  username!: string;

  @ApiProperty({
    description: 'password must contain at least one number',
    type: String,
    format: 'password',
    maxLength: 72,
    minLength: 8,
    writeOnly: true,
  })
  @IsString()
  @Length(8, 72)
  @Matches(/[0-9]/, {
    message: 'password must contain at least one number',
  })
  password!: string;
}