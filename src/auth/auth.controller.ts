// auth.controller.ts
import { Controller, Post, Body, HttpCode, UseGuards, Get, Req, Query, Res, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from './dto/roles.decorator';
import { RolesGuard } from './roles.guard';
import { Response, Request } from 'express';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
@UseGuards(RolesGuard)
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly jwtService: JwtService
  ) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    console.log('createUserDto', createUserDto);
    return this.authService.register(createUserDto);
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() loginUserDto: LoginUserDto, @Res({ passthrough: true }) res: Response) {
    const data = await this.authService.login(loginUserDto);

    res.cookie('access_token', data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });

    return data;
  }

  @UseGuards(AuthGuard('jwt'))
  @Roles('admin')
  @Get('profile')
  getProfile(@Req() req) {
    return req.user; // Logged in user
  }

  @HttpCode(200)
  @Get('verify-email')
  async verifyEmail(@Query('token') token: string) {
    const isVerified = await this.authService.verifyEmail(token);
    return isVerified;
  }

  @HttpCode(200)
  @Get('me')
  async me(@Req() req: Request) {
    const token = req.cookies['access_token'];

    if (!token) {
      throw new UnauthorizedException('Token not found');
    }

    try {
      // ✅ Verifies signature + expiration
      const decoded = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET, // must match sign()
      });
      const user = await this.authService.validateUser(decoded.sub);

      return { token: token, user: user };
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }

  @HttpCode(200)
  @Get('logout')
  logout(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token');
    return { message: 'Logged out successfully' };
  }
}
