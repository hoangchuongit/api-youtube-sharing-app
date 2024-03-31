import { User } from '@modules/users/entities/user.entity';
import { MockEntity } from './entity.mock';
import { createUserStub } from '@modules/users/__mocks__/user.mock';

export class UserEntity extends MockEntity<User> {
  protected entity_stub = createUserStub();
}
