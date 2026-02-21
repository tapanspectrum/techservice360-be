// auth.controller.ts
import { Controller, Post, Body, HttpCode, UseGuards, Get, Req, Query, UnauthorizedException, Res } from '@nestjs/common';
import { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginUserDto } from '../user/dto/login-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from './dto/roles.decorator';
import { RolesGuard } from './roles.guard';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
@UseGuards(RolesGuard)
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly jwtService: JwtService
  ) {}

  @Post('register')
  async register(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    console.log('createUserDto', createUserDto);
    try {
      const result = await this.authService.register(createUserDto);
      return res.status(201).json(result);
    } catch (error) {
      if (
        error?.message === 'tenantId is required unless role is admin' ||
        error?.toString().includes('tenantId is required unless role is admin')
      ) {
        return res.status(403).json({ message: error.message });
      }
      throw error;
    }
  }

  @Post('login')
  @HttpCode(200)
  async login(@Body() loginUserDto: LoginUserDto, @Res({ passthrough: true }) res: Response) {
    const accessToken = await this.authService.login(loginUserDto);
    console.log('accessToken', accessToken?.token);
    res.cookie('access_token', accessToken?.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', // 'none' if cross-domain
      maxAge: 1000 * 60 * 60, // 1 hour
    });

    return this.authService.login(loginUserDto);
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
