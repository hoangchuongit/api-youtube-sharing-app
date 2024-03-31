import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import {
  BadRequestException,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { AuthService } from '../auth.service';
import {
  createUserStub,
  userDetailMock,
} from '@modules/users/__mocks__/user.mock';
import { UsersService } from '@modules/users/users.service';
import { mockJwtService } from '../__mocks__/jwt.mock';
import {
  mock_access_token,
  mock_refresh_token,
  mock_token,
} from '../__mocks__/token.mock';
import { RegisterDto } from '../dto/register.dto';
import { mockConfigService } from '../__mocks__/config-services.mock';
import { User } from '@modules/users/entities/user.entity';

jest.mock('../../users/users.service');

describe('AuthService', function () {
  let auth_service: AuthService;
  let users_service: UsersService;
  let jwt_service: JwtService;
  beforeEach(async () => {
    const module_ref = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        UsersService,
      ],
    }).compile();
    auth_service = module_ref.get<AuthService>(AuthService);
    users_service = module_ref.get<UsersService>(UsersService);
    jwt_service = module_ref.get<JwtService>(JwtService);
  });
  it('should be defined', () => {
    expect(auth_service).toBeDefined();
  });

  describe('register', () => {
    it('should throw a ConflictException if user with email already exists', async () => {
      // Arrange
      jest
        .spyOn(users_service, 'findOneByCondition')
        .mockResolvedValueOnce(createUserStub());
      // Act && Assert
      await expect(auth_service.register(createUserStub())).rejects.toThrow(
        ConflictException,
      );
    });
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
      jest
        .spyOn(auth_service, 'generateAccessToken')
        .mockReturnValue(mock_access_token);
      jest
        .spyOn(auth_service, 'generateRefreshToken')
        .mockReturnValue(mock_refresh_token);
      jest
        .spyOn(bcrypt, 'hash')
        .mockImplementationOnce(() => mock_register_dto.password);
      jest.spyOn(auth_service, 'storeRefreshToken');

      // Act
      const result = await auth_service.register(mock_register_dto);

      // Assert
      expect(users_service.create).toHaveBeenCalledWith({
        ...mock_register_dto,
      });
      expect(auth_service.generateAccessToken).toHaveBeenCalledWith({
        user_id: user_stub._id,
      });
      expect(auth_service.generateRefreshToken).toHaveBeenCalledWith({
        user_id: user_stub._id,
      });
      expect(auth_service.storeRefreshToken).toBeCalledWith(
        user_stub._id,
        mock_refresh_token,
      );
      expect(result).toEqual({
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
    it('should return access token and refresh token when given correct email and password', async () => {
      // Arrange
      const user_stub = createUserStub();
      jest
        .spyOn(auth_service, 'generateAccessToken')
        .mockReturnValue(mock_access_token);
      jest
        .spyOn(auth_service, 'generateRefreshToken')
        .mockReturnValue(mock_refresh_token);
      jest
        .spyOn(bcrypt, 'hash')
        .mockImplementationOnce(() => mock_refresh_token);
      jest.spyOn(auth_service, 'storeRefreshToken');

      // Act
      const result = await auth_service.login(user_stub);

      // Assert
      expect(auth_service.storeRefreshToken).toBeCalledWith(
        user_stub._id,
        mock_refresh_token,
      );
      expect(result).toEqual({
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

  describe('generateAccessToken', () => {
    it('should call jwtService.sign with the provided payload and configuration options', () => {
      // Arrange
      const user_stub = createUserStub();
      // Act
      const result = auth_service.generateAccessToken({
        user_id: user_stub._id as string,
      });

      // Assert
      expect(jwt_service.sign).toHaveBeenCalledWith(
        { user_id: user_stub._id },
        expect.objectContaining({
          algorithm: 'RS256',
          privateKey: expect.any(String),
          expiresIn: expect.any(String),
        }),
      );
      expect(result).toBe(mock_token);
    });
  });

  describe('generateRefreshToken', () => {
    it('should call jwtService.sign with the provided payload and configuration options', () => {
      // Arrange
      const user_stub = createUserStub();
      // Act
      const result = auth_service.generateRefreshToken({
        user_id: user_stub._id as string,
      });

      // Assert
      expect(jwt_service.sign).toBeCalledWith(
        { user_id: user_stub._id },
        expect.objectContaining({
          algorithm: 'RS256',
          privateKey: expect.any(String),
          expiresIn: expect.any(String),
        }),
      );
      expect(result).toBe(mock_token);
    });
  });

  describe('storeRefreshToken', () => {
    it('should call user_service.setCurrentRefreshToken to store refresh token into user database', async () => {
      // Arrange
      const user_stub = createUserStub();
      jest.spyOn(bcrypt, 'hash').mockImplementation(() => mock_refresh_token);
      // Act
      await auth_service.storeRefreshToken(
        user_stub._id as string,
        mock_refresh_token,
      );
      // Assert
      expect(bcrypt.hash).toBeCalledWith(
        mock_refresh_token,
        auth_service['SALT_ROUND'],
      );
      expect(users_service.setCurrentRefreshToken).toBeCalledWith(
        user_stub._id,
        mock_refresh_token,
      );
    });
  });

  describe('getAuthenticatedUser', () => {
    it('should throw a bad request exception if email or password do not match', async () => {
      // Arange
      const user_stub = createUserStub();
      jest.spyOn(users_service, 'getUserByEmail').mockResolvedValueOnce(null);

      // Act & Assert
      // Learn more about asynchronous task https://jestjs.io/docs/expect#rejects
      await expect(
        auth_service.getAuthenticatedUser(user_stub.email, user_stub.password),
      ).rejects.toThrow(BadRequestException);
    });
    it('should return user if email and password are valid', async () => {
      // Arange
      const create_user_stub = createUserStub();
      const user_stub: User = {
        ...create_user_stub,
        fullName: `${create_user_stub.firstName} ${create_user_stub.lastName}`,
        password: 'hashed_password',
      };
      const mock_raw_password = 'raw_password';
      jest
        .spyOn(users_service, 'getUserByEmail')
        .mockResolvedValueOnce(user_stub);
      jest
        .spyOn(auth_service as any, 'verifyPlainContentWithHashedContent')
        .mockResolvedValueOnce(true);
      // Act
      const result = await auth_service.getAuthenticatedUser(
        user_stub.email,
        mock_raw_password,
      );

      // Assert
      expect(result).toEqual(user_stub);
      expect(
        auth_service['verifyPlainContentWithHashedContent'],
      ).toHaveBeenCalledWith(mock_raw_password, user_stub.password);
    });
  });

  describe('getUserIfRefreshTokenMatched', () => {
    it('should throw a not found exception if user id do not match', async () => {
      // Arrange
      const user_stub = createUserStub();
      jest
        .spyOn(users_service, 'findOneByCondition')
        .mockResolvedValueOnce(null);

      // Act & Assert
      await expect(
        auth_service.getUserIfRefreshTokenMatched(
          user_stub._id as string,
          mock_refresh_token,
        ),
      ).rejects.toThrow(UnauthorizedException);
    });
    it('should throw a bad request exception if the refresh token does not match', async () => {
      // Arange
      const create_user_stub = createUserStub();
      const user_stub: User = {
        ...create_user_stub,
        fullName: `${create_user_stub.firstName} ${create_user_stub.lastName}`,
        currentRefreshToken: 'hashed_refresh_token',
      };
      jest
        .spyOn(users_service, 'findOneByCondition')
        .mockResolvedValueOnce(user_stub);

      // Act & Assert
      await expect(
        auth_service.getUserIfRefreshTokenMatched(
          user_stub._id as string,
          mock_refresh_token,
        ),
      ).rejects.toThrow(BadRequestException);
    });
    it('should return a user if the refresh token matches', async () => {
      // Arange
      const create_user_stub = createUserStub();
      const user_stub: User = {
        ...create_user_stub,
        fullName: `${create_user_stub.firstName} ${create_user_stub.lastName}`,
        currentRefreshToken: 'hashed_refresh_token',
      };
      jest
        .spyOn(users_service, 'findOneByCondition')
        .mockResolvedValueOnce(user_stub);

      jest
        .spyOn(auth_service as any, 'verifyPlainContentWithHashedContent')
        .mockResolvedValueOnce(true);

      // Act & Assert
      await expect(
        auth_service.getUserIfRefreshTokenMatched(
          user_stub._id as string,
          mock_refresh_token,
        ),
      ).resolves.toEqual(user_stub);
      expect(
        auth_service['verifyPlainContentWithHashedContent'],
      ).toHaveBeenCalledWith(mock_refresh_token, user_stub.currentRefreshToken);
    });
  });
});
