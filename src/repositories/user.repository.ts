import { User } from '@modules/users/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseRepositoryAbstract } from './base/base.abstract.repository';
import { UsersRepositoryInterface } from '@modules/users/interfaces/user.interface';

@Injectable()
export class UsersRepository
  extends BaseRepositoryAbstract<User>
  implements UsersRepositoryInterface
{
  constructor(
    @InjectModel(User.name)
    private readonly usersRepository: Model<User>,
  ) {
    super(usersRepository);
  }
}
