import { Test } from '@nestjs/testing';
import { UsersService } from '../users.service';
import { createUserStub, userDetailMock } from '../__mocks__/user.mock';
import { RegisterDto } from '@modules/auth/dto/register.dto';
import { User } from '../entities/user.entity';
import { mock_refresh_token } from '@modules/auth/__mocks__/token.mock';

jest.mock('../users.service');

describe('UsersService', function () {
  let users_service: UsersService;
  beforeEach(async () => {
    const module_ref = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();
    users_service = module_ref.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(users_service).toBeDefined();
  });

  describe('create', () => {
    it('should successfully create and return a new user if email is not taken', async () => {
      // Arrange
      const user_stub = createUserStub();
      const mock_register_dto: RegisterDto = {
        email: userDetailMock.email,
        firstName: userDetailMock.firstName,
        lastName: userDetailMock.lastName,
        password: userDetailMock.password,
      };
      jest
        .spyOn(users_service, 'findOneByCondition')
        .mockResolvedValueOnce(null);

      // Act
      const result = await users_service.create(mock_register_dto);

      // Assert
      expect(users_service.create).toHaveBeenCalledWith({
        ...mock_register_dto,
      });

      expect(result).toEqual({
        ...createUserStub(),
      });
    });
  });

  describe('getUserByEmail', () => {
    it('should return user if email are valid', async () => {
      // Arange
      const create_user_stub = createUserStub();
      const user_stub: User = {
        ...create_user_stub,
        fullName: `${create_user_stub.firstName} ${create_user_stub.lastName}`,
      };

      const result = await users_service.getUserByEmail(user_stub.email);

      // Assert
      expect(result).toEqual(user_stub);
    });
  });

  describe('getUserWithRole', () => {
    it('should return user if id are valid', async () => {
      // Arange
      const create_user_stub = createUserStub();
      const user_stub: User = {
        ...create_user_stub,
        fullName: `${create_user_stub.firstName} ${create_user_stub.lastName}`,
      };

      const result = await users_service.getUserWithRole(user_stub.id);

      // Assert
      expect(result).toEqual(user_stub);
    });
  });

  describe('setCurrentRefreshToken', () => {
    it('should return true after set new refresh token valid', async () => {
      // Arange
      const create_user_stub = createUserStub();
      const user_stub: User = {
        ...create_user_stub,
        fullName: `${create_user_stub.firstName} ${create_user_stub.lastName}`,
      };

      const result = await users_service.setCurrentRefreshToken(
        user_stub.id,
        mock_refresh_token,
      );

      // Assert
      expect(result).toEqual(true);
    });
  });
});
