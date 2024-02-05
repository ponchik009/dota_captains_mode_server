import { Injectable } from '@nestjs/common';
import { CaptainsConfigService } from 'src/captains_config/captains_config.service';

@Injectable()
export class SeederService {
  constructor(private readonly captainsConfigService: CaptainsConfigService) {}

  async seed() {
    return await this.configs();
  }

  async configs() {
    return await Promise.all(this.captainsConfigService.seed());
  }
}
