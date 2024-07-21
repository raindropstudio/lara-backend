import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { NxapiService } from './nxapi.service';

@Module({
  imports: [
    HttpModule.register({
      baseURL: 'https://open.api.nexon.com/maplestory/v1',
      headers: {
        Accept: 'application/json',
        'x-nxopen-api-key': process.env.NXAPI_KEY,
      },
      timeout: 5000,
    }),
  ],
  providers: [NxapiService],
  exports: [NxapiService],
})
export class NxapiModule {}
