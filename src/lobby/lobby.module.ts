import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LobbyService } from './lobby.service';
import { LobbyController } from './lobby.controller';
import { Lobby } from './lobby.entity';
import { LobbyPlayer } from './lobbyPlayer.entity';
import { LobbyGateway } from './lobby.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([Lobby, LobbyPlayer])],
  providers: [LobbyGateway, LobbyService],
  controllers: [LobbyController],
})
export class LobbyModule {}
