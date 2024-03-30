import { User } from '@modules/users/entities/user.entity';
import { BaseRepositoryInterface } from '@repositories/base/base.interface.repository';

export interface UsersRepositoryInterface
  extends BaseRepositoryInterface<User> {
  getUserWithRole(user_id: string): Promise<User>;
}
