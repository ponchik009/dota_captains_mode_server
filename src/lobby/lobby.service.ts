import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Lobby, LobbyStatus } from './lobby.entity';
import { User } from 'src/users/users.entity';
import { ICreateLobby } from './interfaces/createLobby.interface';
import { LobbyPlayer, LobbyPlayerSide } from './lobbyPlayer.entity';

@Injectable()
export class LobbyService {
  constructor(
    @InjectRepository(Lobby)
    private lobbyRepository: Repository<Lobby>,
    @InjectRepository(LobbyPlayer)
    private lobbyPlayerRepository: Repository<LobbyPlayer>,
  ) {}

  public async createLobby(dto: ICreateLobby, user: User): Promise<Lobby> {
    const lobby = await this.lobbyRepository.save({
      type: dto.type,
    });

    const lobbyPlayer = await this.lobbyPlayerRepository.save({
      player: { ...user },
      side: dto.side,
      lobby: {
        id: lobby.id,
      },
    });

    return {
      ...lobby,
      players: [lobbyPlayer],
    };
  }

  public async getLobby(id: string) {
    return this.lobbyRepository.findOne({
      where: {
        id,
      },
      relations: {
        players: {
          player: true,
        },
      },
    });
  }

  public async joinLobby(lobbyId: string, user: User) {
    const lobby = await this.getLobby(lobbyId);

    if (lobby.players.length > 1) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Lobby already has players',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (lobby.players.some((p) => p.player.id === user.id)) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'Player already joined the lobby',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    await this.lobbyPlayerRepository.save({
      player: { ...user },
      side:
        lobby.players[0].side === LobbyPlayerSide.DIRE
          ? LobbyPlayerSide.RADIANT
          : LobbyPlayerSide.DIRE,
      lobby: {
        id: lobby.id,
      },
    });

    return await this.getLobby(lobbyId);
  }

  public async start(lobbyId: string) {
    await this.lobbyRepository.update(lobbyId, {
      status: LobbyStatus.PLAY,
    });

    return await this.getLobby(lobbyId);
  }
}
