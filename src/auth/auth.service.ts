// auth.service.ts
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { JwtService } from "@nestjs/jwt";
import { User, UserDocument } from "../user/schemas/user.schema";
import { CreateUserDto } from "../user/dto/create-user.dto";
import { LoginUserDto } from "../user/dto/login-user.dto";
import {
  sendEmail,
  sendVerificationEmail,
} from "../utils/services/email/email.service";

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService
  ) { }

  async register(createUserDto: CreateUserDto): Promise<any> {
    try {
      const userExists = await this.userModel.findOne({
        email: createUserDto.email,
      });
      if (userExists) throw new UnauthorizedException("Email already in use");

      const user = new this.userModel(createUserDto);
      const userData = await user.save();

      const token = await this.generateToken((userData as any)._id.toString());

      // 2️⃣ Send the verification email
      await sendVerificationEmail(user.email, token, user.name);

      return {
        user: {
          id: (userData as any)._id.toString(),
          name: userData.name,
          email: userData.email,
          role: userData.role,
        },
        token,
        msg: "Registration successful! Please verify your email.",
      };
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  }

  async login(loginUserDto: LoginUserDto): Promise<any> {
    const user = await this.userModel.findOne({ email: loginUserDto.email });
    if (!user) throw new UnauthorizedException("Invalid credentials");
    console.log("user", user);
    const isMatch = await user.matchPassword(loginUserDto.password);
    if (!isMatch) throw new UnauthorizedException("Invalid credentials");

    const token = this.generateToken((user as any)._id.toString());
    return { user, token };
  }

  generateToken(userId: string): string {
    return this.jwtService.sign({ sub: userId });
  }

  async validateUser(userId: string): Promise<User | null> {
    // return await this.userModel.findById(userId).select("-password").lean();
    const user = await this.userModel
      .findById(userId)
      .select("-password")
      .lean()
      .exec(); // ensures a proper Promise is returned

    return user as User | null;
  }

  async verifyEmail(token: string): Promise<any> {
    try {
      const decoded: any = this.jwtService.verify(token);
      const userId = decoded.sub;
      const user = await this.userModel.findById(userId);
      if (!user) {
        throw new UnauthorizedException("Invalid token");
      }
      if (user.isVerified) {
        return { msg: "Email already verified" };
      }
      user.isVerified = true;
      await user.save();
      return { msg: "Email verified successfully" };
    } catch (error) {
      throw new UnauthorizedException("Invalid or expired token");
    }
  }
}
