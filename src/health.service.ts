import { Injectable } from '@nestjs/common';
import { Connection } from 'mongoose';
import { InjectConnection } from '@nestjs/mongoose';

@Injectable()
export class HealthService {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  async checkDbStatus() {
    // 1 = connected, 2 = connecting, 0 = disconnected, 3 = disconnecting
    const status = this.connection.readyState;
    return {
      db: status === 1 ? 'up' : 'down',
      dbState: status,
    };
  }
}
