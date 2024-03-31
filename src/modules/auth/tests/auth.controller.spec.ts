import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { RequestWithUser } from 'src/types/requests.type';
import { LocalAuthGuard } from '../guards/local.guard';
import { mock_access_token, mock_refresh_token } from '../__mocks__/token.mock';
import { userDetailMock } from '@modules/users/__mocks__/user.mock';
import { isGuarded } from '@modules/shared/test/utils';
import { mock_request_with_user } from '../__mocks__/requests.mock';

jest.mock('../auth.service.ts');
describe('AuthController', () => {
  let auth_controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    }).compile();

    auth_controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(auth_controller).toBeDefined();
  });

  describe('register', () => {
    it('should create a new user and return an access token and refresh token', async () => {
      // Arrange
      const register_dto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'johndoe@example.com',
        password: '1232@asdS',
      };

      // Act
      const response = await auth_controller.register(register_dto);

      // Assert
      expect(response).toEqual({
        access_token: mock_access_token,
        refresh_token: mock_refresh_token,
        user: {
          id: userDetailMock.id,
          fullName: userDetailMock.fullName,
          email: userDetailMock.email,
        },
      });
    });
  });

  describe('login', () => {
    it('should be protected with LocalAuthGuard', () => {
      expect(isGuarded(AuthController.prototype.login, LocalAuthGuard));
    });
    it('should sign in a user and return an access token', async () => {
      // Arrange

      // Act
      const response = await auth_controller.login(mock_request_with_user);

      // Assert
      expect(response).toEqual({
        access_token: mock_access_token,
        refresh_token: mock_refresh_token,
        user: {
          id: userDetailMock.id,
          fullName: userDetailMock.fullName,
          email: userDetailMock.email,
        },
      });
    });
  });

  describe('refreshAccessToken', () => {
    it('should refresh the access token for a user and return a new access token', async () => {
      // Arrange
      const request = {
        user: {
          _id: 'user_id',
        },
      };

      // Act
      const response = await auth_controller.refreshAccessToken(
        request as RequestWithUser,
      );

      // Assert
      expect(response).toEqual({
        access_token: mock_access_token,
      });
    });
  });
});
