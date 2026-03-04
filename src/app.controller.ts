import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";
import {
  HealthCheckService,
  HealthCheck,
  MongooseHealthIndicator,
} from "@nestjs/terminus";

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private health: HealthCheckService,
    private mongoose: MongooseHealthIndicator // or TypeOrmHealthIndicator if using TypeORM
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get("health")
  @HealthCheck()
  check() {
    return this.health.check([
      () => this.mongoose.pingCheck("database"),
    ]);
  }
}
