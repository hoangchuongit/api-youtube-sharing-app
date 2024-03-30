import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RequestWithUser } from 'src/types/requests.type';
import { RegisterDto } from './dto/register.dto';
import {
  ApiTags,
  ApiOperation,
  ApiBody,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiResponse,
} from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import {
  authRefreshResponseMock,
  authResponseMock,
  loginDtoMock,
  registerDtoMock,
} from './__mocks__/auth.mock';
import { LocalAuthGuard } from './guards/local.guard';
import { JwtRefreshTokenGuard } from './guards/jwt-refresh-token.guard';

@Controller('auth')
@ApiTags('Authorize')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Register API
   */
  @Post('register')
  @ApiOperation({
    summary: 'User register to Youtube Sharing App',
    description: `## User register`,
  })
  @ApiBody({
    type: RegisterDto,
    examples: {
      example: {
        value: registerDtoMock,
      },
    },
  })
  @ApiCreatedResponse({
    description: 'User created successfully!',
    content: {
      'application/json': {
        examples: {
          created_user: {
            summary: 'Response after register',
            value: authResponseMock,
          },
        },
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Validation failed',
    content: {
      'application/json': {
        examples: {
          invalid_email_password: {
            value: {
              statusCode: 400,
              message: [
                'Invalid email address',
                'Password is not strong enough',
              ],
              error: 'Bad Request',
            },
          },
          some_fields_missing: {
            value: {
              statusCode: 400,
              message: [
                'firstName must be shorter than or equal to 50 characters',
                'firstName should not be empty',
                'lastName must be shorter than or equal to 50 characters',
                'lastName should not be empty',
              ],
              error: 'Bad Request',
            },
          },
        },
      },
    },
  })
  @ApiConflictResponse({
    description: 'Conflict user info',
    content: {
      'application/json': {
        examples: {
          email_duplication: {
            value: {
              statusCode: 409,
              message: 'Email is already in use. Please try another email',
              error: 'Conflict',
            },
          },
        },
      },
    },
  })
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }

  /**
   * Login API
   */
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({
    summary: 'User login to Youtube Sharing App',
    description: `## User login`,
  })
  @ApiBody({
    type: LoginDto,
    examples: {
      example: {
        value: loginDtoMock,
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    content: {
      'application/json': {
        example: {
          statusCode: 400,
          message: 'Wrong credentials!',
          error: 'Bad Request',
        },
      },
    },
  })
  @ApiCreatedResponse({
    description: 'Login successfully!',
    content: {
      'application/json': {
        examples: {
          logined_user: {
            summary: 'Response after login',
            value: authResponseMock,
          },
        },
      },
    },
  })
  async login(@Req() request: RequestWithUser) {
    const { user } = request;
    return await this.authService.login(user);
  }

  /**
   * Refresh token API
   */
  @UseGuards(JwtRefreshTokenGuard)
  @Post('refresh')
  @ApiOperation({
    summary: 'Refresh Access-token for User',
    description: `## Refresh Access-token`,
  })
  @ApiCreatedResponse({
    description: 'Re-created access-token successfully!',
    content: {
      'application/json': {
        examples: {
          refresh_token: {
            summary: 'Response after Refresh Access-token',
            value: authRefreshResponseMock,
          },
        },
      },
    },
  })
  async refreshAccessToken(@Req() request: RequestWithUser) {
    const { user } = request;
    const access_token = this.authService.generateAccessToken({
      user_id: user._id.toString(),
    });
    return {
      access_token,
    };
  }
}
