import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local.guard';
import { RequestWithUser } from 'src/types/requests.type';
import { JwtRefreshTokenGuard } from './guards/jwt-refresh-token.guard';
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

@Controller('auth')
@ApiTags('Authorize')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * Register API
   */
  @Post('register')
  @ApiOperation({
    summary: 'User register to platform',
    description: `## User register`,
  })
  @ApiBody({
    type: RegisterDto,
    examples: {
      user_1: {
        value: {
          firstName: 'John',
          lastName: 'Doe',
          email: 'johndoe@example.com',
          password: '1232@asdS',
        } as RegisterDto,
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
            value: {
              access_token:
                'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjQ0MWNkNmJlMWQ0ZTBiNDRjNzA3NDk2IiwiaWF0IjoxNjgyMDM0MDI3LCJleHAiOjE2ODIwMzc2Mjd9.AH4z7uDWuEDjOs8sesB0ItxKUJ2M3rjul1D1mmjAKieOZblej5mp0JQE5IdgB9LlAOzOtKOLL5RWhxLCZ-YskvoRA7Yqza_rOjfIHeNseC3M66kKYqORN07aZDiA2OWhT3pXBqoKRCUBQCKLgMCAPT-CHryc0wUQGaKxP8YJO8dwIhGtjADchmzNJVBs4G7qYnpZAsORayd5GNfgoLpWmVFIBHSnPLNIL4dL8dLof0GBmVhdjhnHIUXYQlqL1wiwsmxmUC9TU2uiChm-TAhuiQyVwFokSySBJzBrLmEtgy89aaR0YizFK-QMg2xW3cJiiRzEBigTdsR0kvdUlk5GOg',
              refresh_token:
                'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjQ0MWNkNmJlMWQ0ZTBiNDRjNzA3NDk2IiwiaWF0IjoxNjgyMDM0MDI3LCJleHAiOjE2ODIwNTkyMjd9.aKNZymKdf3VEbPkda2cYYTS7KlpCbTqdXP30LREQ2b_fJ8q8cA0OyNEARK3Jm5yGsKoNd3txi54XmEbf19LC9CuDf9kwgLasPizEeMZsAJqSbSguzE4-9b4sSdf22GyipCcZJpkXkp01Bew04J8Y4FqhNARONsWzySXg8_VVWOGkfHGJVHFs7xYyVvmt3RErJwRM5s1Ou1ok7VW62FSTSAvXw6-qsHp5T7kXo73jECBqSuNEs5JcdluoBjdaAxggHYaDgTXoRh7y4Mn_fVKCQarAsUAxg6w0fxc8Gj0nP1ct3-GjG-Of-0O-iF7uynI2Lnq_On7WUsH7rFSysNyHUg',
            },
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
                'Email must be an email',
                'Password is not strong enough',
              ],
              error: 'Bad Request',
            },
          },
          some_fields_missing: {
            value: {
              statusCode: 400,
              message: [
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
              message: 'Email already existed!!',
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
    summary: 'User login to platform',
    description: `## User login`,
  })
  @ApiBody({
    type: LoginDto,
    examples: {
      user_1: {
        value: {
          email: 'johndoe@example.com',
          password: '1232@asdS',
        } as LoginDto,
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
          message: 'Wrong credentials!!',
          error: 'Bad Request',
        },
      },
    },
  })
  async login(@Req() request: RequestWithUser) {
    const { user } = request;
    return await this.authService.login(user._id.toString());
  }

  /**
   * Refresh token API
   */
  @UseGuards(JwtRefreshTokenGuard)
  @Post('refresh')
  @ApiOperation({
    summary: 'Refresh Access-token for user',
    description: `## Refresh Access-token`,
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
