import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

import { LobbyPlayer } from './lobbyPlayer.entity';

export enum LobbyStatus {
  WAIT = 'wait',
  PLAY = 'play',
  END = 'end',
}

export enum LobbyType {
  CLOSE = 'close',
  OPEN = 'open',
}

@Entity()
export class Lobby {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: new Date() })
  date: Date;

  @Column({ type: 'enum', enum: LobbyStatus, default: LobbyStatus.WAIT })
  status: LobbyStatus;

  @Column({ type: 'enum', enum: LobbyType })
  type: LobbyType;

  @OneToMany(() => LobbyPlayer, (lp) => lp.lobby)
  players: LobbyPlayer[];
}
