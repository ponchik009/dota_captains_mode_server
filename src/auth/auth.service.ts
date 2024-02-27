import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { User } from 'src/users/users.entity';
import { UsersService } from 'src/users/users.service';

const bigInt = require('big-integer');

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  // async validateUser(steamId: string): Promise<User | null> {
  //   const user = await this.usersService.findBySteamId(steamId);

  //   if (!user) return null;

  //   return user;
  // }

  // async login(user: any) {
  //   const payload = { steamId: user.steamId };

  //   return {
  //     access_token: this.jwtService.sign(payload),
  //   };
  // }

  public async register(steamId: string) {
    return await this.usersService.createUser(steamId);
  }

  public getCookieWithJwtToken(steamId: string) {
    const payload: TokenPayload = { steamId };
    const token = this.jwtService.sign(payload);
    return `Authentication=${token}; Max-Age=${this.configService.get(
      'JWT_EXPIRATION_TIME',
    )}; HttpOnly; Path=/; SameSite=Lax; Secure; Domain=${this.configService.get('JWT_DOMAIN')}`;
  }

  public getCookieForLogOut() {
    return `Authentication=; HttpOnly; Max-Age=0; Path=/; SameSite=Lax; Secure; Domain=${this.configService.get('JWT_DOMAIN')}`;
  }

  public getSteam32ID(steamID64) {
    return bigInt('' + steamID64).minus(bigInt('76561197960265728')).value;
  }
}
