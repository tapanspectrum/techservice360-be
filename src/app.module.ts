import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { RequestLoggerMiddleware } from './utils/middlewares/request-logger.middleware';
import { HttpModule } from '@nestjs/axios';
import { UploadModule } from './upload/upload.module';
import { RolesGuard } from './auth/roles.guard';
import { ScheduleModule } from '@nestjs/schedule';
import { MembershipExpiryTask } from './membership-expiry.task';
import { MailModule } from './mail/mail.module';
import { ClientsModule } from './clients/clients.module';
import { TicketsModule } from './tickets/tickets.module';
import { AmcModule } from './amc/amc.module';
import { ProjectsModule } from './projects/projects.module';
import { InventoryModule } from './inventory/inventory.module';
import { BillingModule } from './billing/billing.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ReportsModule } from './reports/reports.module';
import { SuppliersModule } from './suppliers/suppliers.module';
import { RepairsModule } from './repairs/repairs.module';
import { CctvModule } from './cctv/cctv.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes the configuration globally available in your app
      envFilePath: '.env', // Path to your .env file
    }),
    ConfigModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads', // URL prefix
    }),
    MongooseModule.forRoot(`${process.env.MONGO_URL_DEV}` ||'mongodb://68.168.222.14:21007/techservice'),
    WinstonModule.forRoot({
      transports: [
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.timestamp(),
            winston.format.colorize(),
            winston.format.printf(({ timestamp, level, message, context }) => {
              return `[${timestamp}] ${level} ${context || ''}: ${message}`;
            })
          ),
        }),
      ],
    }),
    UserModule,
    AuthModule,
    HttpModule.register({
      timeout: 3000,
      maxRedirects: 5,
    }),
    UploadModule,
    ScheduleModule.forRoot(),
    MailModule,
    ClientsModule,
    TicketsModule,
    AmcModule,
    ProjectsModule,
    InventoryModule,
    BillingModule,
    NotificationsModule,
    ReportsModule,
    SuppliersModule,
    RepairsModule,
    CctvModule,
    DashboardModule
  ],
  controllers: [AppController, HealthController],
  providers: [AppService, RolesGuard, MembershipExpiryTask, HealthService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
