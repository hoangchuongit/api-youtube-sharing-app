import { UsersService } from '@modules/users/users.service';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { access_token_public_key } from 'src/constraints/jwt.constraint';
import { ITokenPayload } from '../interfaces/token.interface';

@Injectable()
export class JwtAccessTokenStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly users_service: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: true,
      secretOrKey: access_token_public_key,
    });
  }

  async validate(payload: ITokenPayload) {
    return await this.users_service.getUserWithRole(payload.user_id);
  }
}
