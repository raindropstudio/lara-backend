import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NxapiModule } from './nxapi/nxapi.module';
import { NxapiService } from './nxapi/nxapi.service';

@Module({
  imports: [NxapiModule],
  controllers: [AppController],
  providers: [AppService, NxapiService],
})
export class AppModule {}
