import { User } from '@book/interfaces';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  private readonly users: User[] = [
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
}
