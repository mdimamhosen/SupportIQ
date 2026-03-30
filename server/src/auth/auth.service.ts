import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { User } from '../users/user.entity';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signup(
    email: string,
    password: string,
    firstName?: string,
    lastName?: string,
  ): Promise<User> {
    const existingUser = await this.usersService.findOneByEmail(email);
    if (existingUser) {
      throw new ConflictException('Email address already in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    return this.usersService.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });
  }

  async login(
    email: string,
    password: string,
  ): Promise<{ access_token: string; user: Partial<User> }> {
    const user = await this.usersService.findOneByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const userWithoutPassword = { ...user };
    delete (userWithoutPassword as Partial<User>).password;
    const payload: JwtPayload = { sub: user.id, email: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: userWithoutPassword,
    };
  }
}
