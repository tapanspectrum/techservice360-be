import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";
import {
  HealthCheckService,
  HealthCheck,
  HttpHealthIndicator,
  TypeOrmHealthIndicator,
  MongooseHealthIndicator,
} from "@nestjs/terminus";

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private mongoose: MongooseHealthIndicator // or TypeOrmHealthIndicator if using TypeORM
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get("health")
  @HealthCheck()
  check() {
    try {
      return this.health.check([
        // check API (self)
        () => this.http.pingCheck("self", "http://localhost:3000/api/v1"),

        // check MongoDB (if applicable)
        () => this.mongoose.pingCheck("database"),
      ]);
    } catch (error) {
      console.error("Health check failed:", error);
      return { status: "error", message: error.message };
    }
  }
}
