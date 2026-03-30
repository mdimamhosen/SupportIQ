import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
  Req,
  ValidationPipe,
  UsePipes,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';
import * as bcrypt from 'bcrypt';
import { Request } from 'express';
import { User } from './user.entity';

interface RequestWithUser extends Request {
  user: User;
}

@Controller('profile')
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(private usersService: UsersService) {}

  @Get('/me')
  async getProfile(@Req() req: RequestWithUser) {
    const user = await this.usersService.findOneById(req.user.id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const { password: _, ...result } = user;
    return result;
  }

  @Patch('/update')
  @UsePipes(ValidationPipe)
  async updateProfile(
    @Req() req: RequestWithUser,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    const userId = req.user.id;
    const { firstName, lastName, password } = updateProfileDto;

    const updateData: Partial<User> = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await this.usersService.update(userId, updateData);

    const { password: _, ...result } = updatedUser;
    return result;
  }
}
