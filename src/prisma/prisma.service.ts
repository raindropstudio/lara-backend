import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  constructor() {
    super({
      log: process.env.NODE_ENV !== 'production' ? ['query', 'info', 'warn', 'error'] : ['warn', 'error'],
    });

    if (process.env.NODE_ENV !== 'production') {
      this.$on('query' as never, (e: any) => {
        console.log('Duration: ' + e.duration + 'ms');
      });
    }
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
