import { User } from '@book/interfaces';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

export enum TokenType {
  AccessToken,
  RefreshToken
}

@Injectable()
export class AuthenticationService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async validateUser(username: string, passwordHash: string): Promise<Partial<User>> {
    const user = await this.userService.findUser(username);
    if (user && user.password === passwordHash) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: User) {
    return {
      accessToken: this.createAccessToken(user),
      refreshToken: await this.createRefreshToken(user)
    };
  }

  async refresh(token: string) {
    const tokenData = this.jwtService.decode(token);
    if(!tokenData) {
        throw new HttpException(
          'Cannot decode refreshToken',
          HttpStatus.UNAUTHORIZED
        );
    }

    if (tokenData.sub) {
      const user = await this.userService.findUserById(tokenData.sub);
      console.log(user);
      if (!user) {
        throw new HttpException(
          'Cannot find user with refreshToken',
          HttpStatus.UNAUTHORIZED
        );
      }

      return {
        accessToken: this.createAccessToken(user),
      };
    }
    return true;
  }

  createAccessToken(user: User) {
    // const expires = Date.now() + 1 * 30;
    const payload = {
      username: user.username,
      sub: user.userId,
      type: TokenType.AccessToken
      // exp: expires * 1000
    };

    const token = this.jwtService.sign(payload, {
      expiresIn: '5m'
    });
    // console.log(new Date(expires * 1000));
    console.log(this.jwtService.decode(token));
    return token;
  }

  async createRefreshToken(user: User) {
    // const expires = Date.now() + 5 * 60;
    const payload = {
      username: user.username,
      sub: user.userId,
      type: TokenType.RefreshToken,
      // exp: expires,
    };

    const token = this.jwtService.sign(payload, {
      expiresIn: '7d',
    });
    // console.log(new Date(expires));
    // console.log(this.jwtService.decode(token));
    await this.userService.setToken(user.userId, token);
    return token;
  }
}
