import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { jwtConstants } from './constants';
import { UserService } from '../user/user.service';
import { User } from '@book/interfaces';
import { TokenType } from './authentication.service';

interface JwtPayload {
  sub: string;
  username: string;
  type: TokenType;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtConstants.secret,
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    if (payload.type !== TokenType.AccessToken) {
      throw new HttpException('Wrong token type', HttpStatus.UNAUTHORIZED);
    }

    const user = await this.userService.findUserById(payload.sub);
    if (!user) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }
}
