import { NestFactory } from '@nestjs/core';

import { SeederModule } from './seeder/seeder.module';
import { SeederService } from './seeder/seeder.service';

async function bootstrap() {
  NestFactory.createApplicationContext(SeederModule)
    .then((appContext) => {
      const seeder = appContext.get(SeederService);

      seeder.seed().finally(() => appContext.close());
    })
    .catch((error) => {
      throw error;
    });
}

bootstrap();
