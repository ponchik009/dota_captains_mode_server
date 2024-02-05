import { Controller, Get } from '@nestjs/common';
import { CaptainsConfigService } from './captains_config.service';

@Controller('captains-config')
export class CaptainsConfigController {
  constructor(private captainsConfigService: CaptainsConfigService) {}

  @Get('/picks/last')
  public async getPicksLast() {
    return this.captainsConfigService.findLastPicksConfig();
  }

  @Get('/audio/last')
  public async getAudioLast() {
    return this.captainsConfigService.findLastAudioConfig();
  }
}
