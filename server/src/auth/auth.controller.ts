import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  UsePipes,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  @UsePipes(ValidationPipe)
  async signup(@Body() authCredentialsDto: AuthCredentialsDto) {
    return this.authService.signup(
      authCredentialsDto.email,
      authCredentialsDto.password,
      authCredentialsDto.firstName,
      authCredentialsDto.lastName,
    );
  }

  @Post('/login')
  @UsePipes(ValidationPipe)
  async login(@Body() authCredentialsDto: AuthCredentialsDto) {
    return this.authService.login(
      authCredentialsDto.email,
      authCredentialsDto.password,
    );
  }
}
