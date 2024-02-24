import { LobbyType } from '../lobby.entity';
import { LobbyPlayerSide } from '../lobbyPlayer.entity';

export interface ICreateLobby {
  side: LobbyPlayerSide;
  type: LobbyType;
}
