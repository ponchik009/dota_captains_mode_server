import { Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import axios from 'axios';

import { AuthService } from './auth.service';
import RequestWithUser from './interface/requestWithUser.interface';
import JwtAuthenticationGuard from './guard/jwt.guard';
import { ConfigService } from '@nestjs/config';

const SteamAuth = require('node-steam-openid');

@Controller('auth')
export class AuthController {
  private steamService: any;

  constructor(
    private authService: AuthService,
    private configService: ConfigService,
  ) {
    const config = {
      realm: this.configService.get('STEAM_REALM'), // Site name displayed to users on logon
      returnUrl: this.configService.get('STEAM_RETURN_URL'), // Your return route
      apiKey: this.configService.get('STEAM_API_KEY'), // Steam API key
    };

    this.steamService = new SteamAuth(config);
  }

  @Get('/login')
  async login(@Res() response: Response) {
    const redirectUrl = await this.steamService.getRedirectUrl();
    return response.redirect(redirectUrl);
  }

  @Get('/login/steam')
  async loginSteam(@Req() req, @Res() response: Response) {
    try {
      const user = await this.steamService.authenticate(req);

      const steamID32 = this.authService.getSteam32ID(user.steamid);

      const userFromOpenDota = (
        await axios.get(`https://api.opendota.com/api/players/${steamID32}`)
      ).data;

      await this.authService.register(userFromOpenDota.profile.account_id);

      const cookie = this.authService.getCookieWithJwtToken(
        userFromOpenDota.profile.account_id,
      );

      response.setHeader('Set-Cookie', cookie);

      return response.redirect(this.configService.get('STEAM_REDIRECT_URL'));
    } catch (error) {
      console.error(error);

      return response.send('pizdec');
    }
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post('logout')
  async logOut(@Req() request: RequestWithUser, @Res() response: Response) {
    response.setHeader('Set-Cookie', this.authService.getCookieForLogOut());
    return response.sendStatus(200);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Get()
  async authenticate(@Req() request: RequestWithUser) {
    const user = request.user;

    const userFromOpenDota = (
      await axios.get(`https://api.opendota.com/api/players/${user.steamId}`)
    ).data;

    return {
      ...userFromOpenDota,
      id: user.id,
    };
  }
}
