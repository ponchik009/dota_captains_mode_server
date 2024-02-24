import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Column,
} from 'typeorm';

import { User } from 'src/users/users.entity';
import { Lobby } from './lobby.entity';

export enum LobbyPlayerSide {
  RADIANT = 'radiant',
  DIRE = 'dire',
}

@Entity()
export class LobbyPlayer {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: LobbyPlayerSide })
  side: LobbyPlayerSide;

  @ManyToOne(() => User)
  @JoinColumn()
  player: User;

  @ManyToOne(() => Lobby, (l) => l.players)
  @JoinColumn()
  lobby: Lobby;
}
