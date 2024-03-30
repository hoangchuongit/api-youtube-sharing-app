import { Inject, Injectable } from '@nestjs/common';
import { BaseServiceAbstract } from 'src/services/base/base.abstract.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepositoryInterface } from './interfaces/user.interface';

@Injectable()
export class UsersService extends BaseServiceAbstract<User> {
  constructor(
    @Inject('UsersRepositoryInterface')
    private readonly usersRepository: UsersRepositoryInterface,
  ) {
    super(usersRepository);
  }

  async create(createDto: CreateUserDto): Promise<User> {
    const user = await this.usersRepository.create({
      ...createDto,
    });
    return user;
  }
}
