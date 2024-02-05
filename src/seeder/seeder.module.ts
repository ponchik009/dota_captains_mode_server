import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { SeederService } from './seeder.service';
import { CaptainsConfigModule } from 'src/captains_config/captains_config.module';
import { CaptainsConfig } from 'src/captains_config/captains_сonfig.entity';

@Module({
  imports: [
    CaptainsConfigModule,
    ConfigModule.forRoot({
      envFilePath: ['.env.local', '.env.prod'],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB'),
        entities: [CaptainsConfig],
        synchronize: true,
      }),
    }),
    TypeOrmModule.forFeature([CaptainsConfig]),
  ],
  providers: [SeederService],
})
export class SeederModule {}
