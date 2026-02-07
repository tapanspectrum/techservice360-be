// auth.controller.ts
import {
  Controller,
  Post,
  Body,
  HttpCode,
  UseGuards,
  Get,
  Req,
  Query,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "../user/dto/create-user.dto";
import { LoginUserDto } from "../user/dto/login-user.dto";
import { AuthGuard } from "@nestjs/passport";
import { Roles } from "./dto/roles.decorator";
import { RolesGuard } from "./roles.guard";

@Controller("auth")
@UseGuards(RolesGuard)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post("register")
  async register(@Body() createUserDto: CreateUserDto) {
    console.log("createUserDto", createUserDto);
    return this.authService.register(createUserDto);
  }

  @Post("login")
  @HttpCode(200)
  async login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @UseGuards(AuthGuard("jwt"))
  @Roles('admin')
  @Get("profile")
  getProfile(@Req() req) {
    return req.user; // Logged in user
  }

  @HttpCode(200)
  @Get("verify-email")
  async verifyEmail(@Query("token") token: string) {
    const isVerified = await this.authService.verifyEmail(token);
    return isVerified;
  }
}
