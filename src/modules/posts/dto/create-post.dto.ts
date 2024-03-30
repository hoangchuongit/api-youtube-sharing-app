import { User } from '@modules/users/entities/user.entity';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreatePostDto {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  link: string;

  @IsOptional()
  description: string;

  @IsOptional()
  user: User;
}
