import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Req, UseGuards } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

import { LobbyService } from './lobby.service';
import RequestWithUser from 'src/auth/interface/requestWithUser.interface';
import JwtAuthenticationGuard from 'src/auth/guard/jwt.guard';
import { User } from 'src/users/users.entity';
import { Lobby } from './lobby.entity';
import axios from 'axios';

@WebSocketGateway(3002, {
  cors: ['http://localhost:3000', 'ws://localhost:3000'],
  cookie: true,
})
export class LobbyGateway {
  @WebSocketServer()
  server: Server;

  state: Map<string, { users: Array<User>; lobby: Lobby }>;

  constructor(private lobbyService: LobbyService) {
    this.state = new Map();
  }

  @UseGuards(JwtAuthenticationGuard)
  @SubscribeMessage('join_lobby')
  async handleMessage(
    @MessageBody() lobbyId: string,
    @ConnectedSocket() client: Socket,
    @Req() request: RequestWithUser,
  ) {
    client.join(lobbyId);

    const userFromOpenDota = (
      await axios.get(
        `https://api.opendota.com/api/players/${request.user.steamId}`,
      )
    ).data;

    try {
      // join as player
      const lobby = await this.lobbyService.joinLobby(lobbyId, request.user);
      console.log('join player');

      this.state.set(lobbyId, {
        users: [
          ...(this.state
            .get(lobbyId)
            ?.users?.filter((u) => u.id !== request.user.id) || []),
          { ...userFromOpenDota, ...request.user },
        ],
        lobby,
      });
    } catch (e) {
      // join as viewer
      console.log('join viewer or already existed player');
      const lobby = await this.lobbyService.getLobby(lobbyId);
      this.state.set(lobbyId, {
        users: [
          ...(this.state
            .get(lobbyId)
            ?.users?.filter((u) => u.id !== request.user.id) || []),
          { ...userFromOpenDota, ...request.user },
        ],
        lobby,
      });
    }

    console.log(this.state.get(lobbyId));

    client.to(lobbyId).emit('joined_lobby', this.state.get(lobbyId));
    client.emit('joined_lobby', this.state.get(lobbyId));
  }
}
