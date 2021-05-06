import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { Connection, Model } from "mongoose";
import { User } from "./entities/user.entity";
import { JwtService } from "@nestjs/jwt";
import { AuthCredentialsDto } from "./dtos/auth-credentials.dto";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {

  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectConnection() private readonly connection: Connection,
    private jwtService: JwtService
  ) {
  }

  async signUp(authCredentials: AuthCredentialsDto): Promise<void> {

    const { username, password } = authCredentials;

    const userDB = await this.userModel.findOne({ username }).exec();

    if (userDB) {
      throw new ConflictException("Username already exists");
    }


    const user = new this.userModel();
    user.username = username;
    user.salt = await bcrypt.genSalt();
    user.password = await this.hashPassword(password, user.salt);


    try {
      await user.save();
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async signIn(authCredentials: AuthCredentialsDto): Promise<{ accessToken: string }> {
    const username = await this.validateUserPassword(authCredentials);
    if (!username) {
      throw new UnauthorizedException("Invalid credentials!");
    }
    const payload = { username };
    const accessToken = await this.jwtService.sign(payload);
    return { accessToken };
  }

  private async hashPassword(password: string, salt: string): Promise<string> {
    return bcrypt.hash(password, salt);
  }

  async validateUserPassword(
    authCredentials: AuthCredentialsDto,
  ): Promise<string> {
    const { username, password } = authCredentials;
    const user = await this.userModel.findOne({ username }).exec();

    if (user && await this.validatePassword(user, password)) {
      return user.username;
    } else {
      return null;
    }
  }

  async validatePassword(user: User, password: string): Promise<boolean> {
    const hash = await bcrypt.hash(password, user.salt);
    return hash === user.password;
  }

}
