import { User } from '@book/interfaces';
import { Injectable } from '@nestjs/common';

type UserWithRefreshToken = User & { refreshToken?: string };

@Injectable()
export class UserService {

  private readonly users: UserWithRefreshToken[] = [
    {
      userId: '1',
      username: 'john',
      password: 'changeme',
    },
    {
      userId: '2',
      username: 'maria',
      password: 'guess',
    },
    {
      userId: '3',
      username: 'jelle',
      password: 'test',
    },
  ];

  async findUser(username: string): Promise<User | undefined> {
    return this.users.find((user: User) => user.username === username);
  }

  async findUserById(userId: string | number): Promise<User | undefined> {
    return this.users.find((user: User) => user.userId === userId);
  }

  async setToken(userId: string, token: string) {
    const user = this.users.find((user: User) => user.userId === userId);
    user.refreshToken = token;
  }  
}
