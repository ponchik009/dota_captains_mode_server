import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { CaptainsConfig, ConfigTypes } from './captains_сonfig.entity';
import { CaptainsConfigs } from './data';
import { ICaptainsConfig } from './captains_config.interface';

@Injectable()
export class CaptainsConfigService {
  constructor(
    @InjectRepository(CaptainsConfig)
    private captainsConfigRepository: Repository<CaptainsConfig>,
  ) {}

  public async findLastPicksConfig() {
    return (
      this.captainsConfigRepository
        .find({
          where: { type: ConfigTypes.picks },
          order: { date: 'DESC' },
          take: 1,
        })
        // гагага
        .then((arr) => ({ ...arr[0], config: JSON.parse(arr[0].config) }))
    );
  }

  public async findLastAudioConfig() {
    return (
      this.captainsConfigRepository
        .find({
          where: { type: ConfigTypes.audio },
          order: { date: 'DESC' },
          take: 1,
        })
        // гагага
        .then((arr) => ({ ...arr[0], config: JSON.parse(arr[0].config) }))
    );
  }

  public seed(): Array<Promise<CaptainsConfig>> {
    return CaptainsConfigs.map(async (config: ICaptainsConfig) => {
      return await this.captainsConfigRepository
        .findOne({
          where: {
            config: config.config,
          },
        })
        .then(async (dbConfig) => {
          // We check if a language already exists.
          // If it does don't create a new one.
          if (dbConfig) {
            return Promise.resolve(null);
          }

          return this.captainsConfigRepository.save(config);
        })
        .catch((error) => Promise.reject(error));
    });
  }
}
