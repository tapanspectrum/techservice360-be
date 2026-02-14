import { Controller, Get, Res, HttpStatus } from '@nestjs/common';
import { HealthService } from './health.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  async getHealth(@Res() res) {
    const dbStatus = await this.healthService.checkDbStatus();
    if (dbStatus.db === 'up') {
      return res.status(HttpStatus.OK).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        db: dbStatus.db,
        dbState: dbStatus.dbState,
      });
    } else {
      return res.status(HttpStatus.SERVICE_UNAVAILABLE).json({
        status: 'error',
        db: 'down',
        dbState: dbStatus.dbState,
        timestamp: new Date().toISOString(),
      });
    }
  }
}
