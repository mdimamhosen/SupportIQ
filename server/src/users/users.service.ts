import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findOneByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findOneById(id: number): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async create(userData: Partial<User>): Promise<User> {
    if (!userData.username) {
      userData.username = await this.generateUniqueUsername(
        userData.email || '',
      );
    }
    const user = this.usersRepository.create(userData);
    return this.usersRepository.save(user);
  }

  async update(id: number, updateData: Partial<User>): Promise<User> {
    await this.usersRepository.update(id, updateData);
    const user = await this.findOneById(id);
    if (!user) {
      throw new Error(`User with id ${id} not found after update`);
    }
    return user;
  }

  private async generateUniqueUsername(email: string): Promise<string> {
    const base = email
      .split('@')[0]
      .replace(/[^a-zA-Z0-9]/g, '')
      .toLowerCase();
    let username = base;
    let counter = 1;

    while (await this.usersRepository.findOne({ where: { username } })) {
      username = `${base}${Math.floor(Math.random() * 10000)}`;
      counter++;
      if (counter > 10) break;
    }

    return username;
  }
}
