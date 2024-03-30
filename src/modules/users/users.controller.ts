import { Controller, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import MongooseClassSerializerInterceptor from 'src/interceptors/mongoose-class-serializer.interceptor';

@Controller('users')
@UseInterceptors(MongooseClassSerializerInterceptor(User))
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
}
