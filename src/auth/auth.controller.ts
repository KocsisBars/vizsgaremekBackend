import { Body, Controller, Get, Post, Req, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { User } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    try {
      return await this.authService.login(loginDto);
    } catch (e) {
      throw new UnauthorizedException('Invalid username or password');
    }
  }

  @Get('me')
  @UseGuards(AuthGuard('bearer'))
  async me(@Req() req: Request) {
    const user = req.user as User;
    delete user.password;
    return user;
  }

  @Get('role')
  @UseGuards(AuthGuard('bearer'))
  async getRole(@Req() req: any) {
    const user = req.user as User;
    return { role: user.role };
  }
}
