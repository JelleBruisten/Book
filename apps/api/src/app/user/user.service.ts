import { User } from '@book/interfaces';
import { Injectable } from '@nestjs/common';

export type UserWithRefreshToken = User & { refreshToken?: string };

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
      refreshToken:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImplbGxlIiwic3ViIjoiMyIsInR5cGUiOjEsImlhdCI6MTYwODI0MjQ2MSwiZXhwIjoxNjA4ODQ3MjYxfQ.LzhhuwW-5BRWm09kU_cOhaOL_braVNcLk0A3sZDVWNs'
    },
  ];

  async findUser(username: string): Promise<UserWithRefreshToken | undefined> {
    return this.users.find(
      (user: UserWithRefreshToken) => user.username === username
    );
  }

  async findUserById(
    userId: string | number
  ): Promise<UserWithRefreshToken | undefined> {
    return this.users.find(
      (user: UserWithRefreshToken) => user.userId === userId
    );
  }

  async setToken(userId: string, token: string) {
    const user = this.users.find(
      (user: UserWithRefreshToken) => user.userId === userId
    );
    user.refreshToken = token;
  }

  async tokenMatchesUser(userId: string, token: string) {
    const user = this.users.find(
      (user: UserWithRefreshToken) => user.userId === userId
    );
    return user.refreshToken === token;
  }
}
