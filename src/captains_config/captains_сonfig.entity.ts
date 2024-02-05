import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export enum ConfigTypes {
  'picks',
  'audio',
}

@Entity()
export class CaptainsConfig {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ default: new Date() })
  date: Date;

  @Column({ type: 'enum', enum: ConfigTypes })
  type: ConfigTypes;

  @Column()
  config: string;
}
