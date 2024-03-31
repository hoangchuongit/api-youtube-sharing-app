import {
  createUserStub,
  userDetailMock,
} from '@modules/users/__mocks__/user.mock';
import { mock_access_token, mock_refresh_token } from './token.mock';

export const AuthService = jest.fn().mockReturnValue({
  register: jest.fn().mockResolvedValue({
    access_token: mock_access_token,
    refresh_token: mock_refresh_token,
    user: {
      id: userDetailMock.id,
      fullName: userDetailMock.fullName,
      email: userDetailMock.email,
    },
  }),
  login: jest.fn().mockResolvedValue({
    access_token: mock_access_token,
    refresh_token: mock_refresh_token,
    user: {
      id: userDetailMock.id,
      fullName: userDetailMock.fullName,
      email: userDetailMock.email,
    },
  }),
  getAuthenticatedUser: jest.fn().mockResolvedValue(createUserStub()),
  getUserIfRefreshTokenMatched: jest.fn().mockRejectedValue(createUserStub()),
  generateAccessToken: jest.fn().mockReturnValue(mock_access_token),
  generateRefreshToken: jest.fn().mockReturnValue(mock_refresh_token),
});
