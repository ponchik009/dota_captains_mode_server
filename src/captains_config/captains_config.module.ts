import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CaptainsConfigService } from './captains_config.service';
import { CaptainsConfigController } from './captains_config.controller';

import { CaptainsConfig } from './captains_сonfig.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CaptainsConfig])],
  providers: [CaptainsConfigService],
  controllers: [CaptainsConfigController],
  exports: [CaptainsConfigService],
})
export class CaptainsConfigModule {}
