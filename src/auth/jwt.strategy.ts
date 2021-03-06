import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Connection, Model } from 'mongoose';
import { InjectConnection, InjectModel } from "@nestjs/mongoose";
import { JwtPayload } from './jwt-payload.interface';
import { User } from './entities/user.entity';
import * as config from 'config';
const jwtConfig = config.get('jwt');
const secret = process.env.SECRET || jwtConfig.secret;

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    @InjectConnection() private readonly connection: Connection,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secret,
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    const { username } = payload;
    const user = await this.userModel.findOne({ username }).exec();

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
