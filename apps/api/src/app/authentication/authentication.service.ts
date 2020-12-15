import { User } from '@book/interfaces';
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthenticationService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async validateUser(username: string,passwordHash: string): Promise<Partial<User>> {
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

    const tokenData = this.jwtService.decode(token) as { userId: string | number};
    if(tokenData.userId) {

      const user = await this.userService.findUserById(tokenData.userId);
      if (user.refreshToken === token) {
        throw new UnauthorizedException();
      }

      return {
        accessToken: this.createAccessToken(user)
      };
    }
    return false;
  }

  createAccessToken(user: User) {
    const expires = Date.now() + 1 * 60 * 1000;
    const payload = {
      username: user.username,
      sub: user.userId,
      exp: expires
    };

    const token = this.jwtService.sign(payload);
    console.log(new Date(expires));
    console.log(this.jwtService.decode(token));
    return token;
  }

  async createRefreshToken(user: User) {
    const expires = Date.now() + 5 * 60 * 1000;
    const payload = {
      username: user.username,
      sub: user.userId,
      exp: expires,
    };

    const token = this.jwtService.sign(payload);
    console.log(new Date(expires));
    console.log(this.jwtService.decode(token));
    await this.userService.setToken(user.userId, token);
    return token;
  }
}
