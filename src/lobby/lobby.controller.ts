import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { LobbyService } from './lobby.service';
import JwtAuthenticationGuard from 'src/auth/guard/jwt.guard';
import RequestWithUser from 'src/auth/interface/requestWithUser.interface';
import { ICreateLobby } from './interfaces/createLobby.interface';

@Controller('lobby')
export class LobbyController {
  constructor(private lobbyService: LobbyService) {}

  @UseGuards(JwtAuthenticationGuard)
  @Get(':id')
  async getLobby(@Param('id') lobbyId: string) {
    return await this.lobbyService.getLobby(lobbyId);
  }

  @UseGuards(JwtAuthenticationGuard)
  @Post()
  async createLobby(
    @Body() dto: ICreateLobby,
    @Req() request: RequestWithUser,
  ) {
    const { user } = request;
    return await this.lobbyService.createLobby(dto, user);
  }
}
