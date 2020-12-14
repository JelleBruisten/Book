import { User } from '@book/interfaces';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthenticationService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService
  ) {}

  async validateUser(
    username: string,
    passwordHash: string
  ): Promise<Partial<User>> {
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
      return {
        accessToken: this.createAccessToken(user)
      };
    }
    return false;
  }

  createAccessToken(user: User) {
    const payload = { username: user.username, sub: user.userId };
    return this.jwtService.sign(payload, {
      expiresIn: '15m'
    });
  }

  async createRefreshToken(user: User) {
    const payload = { username: user.username, sub: user.userId };
    const token = this.jwtService.sign(payload, {
      expiresIn: '6h'
    });    
    await this.userService.setToken(user.userId, token);    
    return token;
  }
}
