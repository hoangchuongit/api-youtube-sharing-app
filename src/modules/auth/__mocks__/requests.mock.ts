import { createUserStub } from '@modules/users/__mocks__/user.mock';
import { RequestWithUser } from 'src/types/requests.type';

export const mock_request_with_user = {
  user: createUserStub(),
} as RequestWithUser;
