import { User } from '@modules/users/entities/user.entity';
import { UsersService } from '@modules/users/users.service';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import {
  access_token_private_key,
  refresh_token_private_key,
} from 'src/constraints/jwt.constraint';
import { RegisterDto } from './dto/register.dto';
import { IAuthResponse } from './interfaces/auth.interface';
import { ITokenPayload } from './interfaces/token.interface';

@Injectable()
export class AuthService {
  private SALT_ROUND = 11;
  constructor(
    private configService: ConfigService,
    private readonly users_service: UsersService,
    private readonly jwt_service: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<IAuthResponse> {
    try {
      const existed_user = await this.users_service.findOneByCondition({
        email: registerDto.email,
      });

      if (existed_user) {
        throw new ConflictException(
          'Email is already in use. Please try another email',
        );
      }

      const hashed_password = await bcrypt.hash(
        registerDto.password,
        this.SALT_ROUND,
      );

      const user = await this.users_service.create({
        ...registerDto,
        password: hashed_password,
      });

      const refresh_token = this.generateRefreshToken({
        user_id: user._id.toString(),
      });

      await this.storeRefreshToken(user._id.toString(), refresh_token);

      const response: IAuthResponse = {
        access_token: this.generateAccessToken({
          user_id: user._id.toString(),
        }),
        refresh_token,
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
        },
      };

      return response;
    } catch (error) {
      throw error;
    }
  }

  async login(user: User): Promise<IAuthResponse> {
    try {
      const user_id = user.id;

      const access_token = this.generateAccessToken({
        user_id,
      });

      const refresh_token = this.generateRefreshToken({
        user_id,
      });

      await this.storeRefreshToken(user_id, refresh_token);

      const response: IAuthResponse = {
        access_token,
        refresh_token,
        user: {
          id: user.id,
          fullName: user.fullName,
          email: user.email,
        },
      };

      return response;
    } catch (error) {
      throw error;
    }
  }

  async getAuthenticatedUser(email: string, password: string): Promise<User> {
    try {
      const user = await this.users_service.getUserByEmail(email);
      await this.verifyPlainContentWithHashedContent(password, user.password);
      return user;
    } catch (error) {
      throw new BadRequestException('Wrong credentials!!');
    }
  }

  private async verifyPlainContentWithHashedContent(
    plain_text: string,
    hashed_text: string,
  ) {
    const is_matching = await bcrypt.compare(plain_text, hashed_text);
    if (!is_matching) {
      throw new BadRequestException();
    }
  }

  async getUserIfRefreshTokenMatched(
    user_id: string,
    refresh_token: string,
  ): Promise<User> {
    try {
      const user = await this.users_service.findOneByCondition({
        _id: user_id,
      });
      if (!user) {
        throw new UnauthorizedException();
      }
      await this.verifyPlainContentWithHashedContent(
        refresh_token,
        user.currentRefreshToken,
      );
      return user;
    } catch (error) {
      throw error;
    }
  }

  generateAccessToken(payload: ITokenPayload) {
    return this.jwt_service.sign(payload, {
      algorithm: 'RS256',
      privateKey: access_token_private_key,
      expiresIn: `${this.configService.get<string>(
        'JWT_ACCESS_TOKEN_EXPIRATION_TIME',
      )}s`,
    });
  }

  generateRefreshToken(payload: ITokenPayload) {
    return this.jwt_service.sign(payload, {
      algorithm: 'RS256',
      privateKey: refresh_token_private_key,
      expiresIn: `${this.configService.get<string>(
        'JWT_REFRESH_TOKEN_EXPIRATION_TIME',
      )}s`,
    });
  }

  async storeRefreshToken(user_id: string, token: string): Promise<void> {
    try {
      const hashed_token = await bcrypt.hash(token, this.SALT_ROUND);
      await this.users_service.setCurrentRefreshToken(user_id, hashed_token);
    } catch (error) {
      throw error;
    }
  }
}
