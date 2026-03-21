import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { RequestLoggerMiddleware } from './utils/middlewares/request-logger.middleware';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import { UploadModule } from './upload/upload.module';
import { RolesGuard } from './auth/roles.guard';
import { ScheduleModule } from '@nestjs/schedule';
import { MembershipExpiryTask } from './membership-expiry.task';
import { MailModule } from './mail/mail.module';
import { NotificationsModule } from './notifications/notifications.module';
import { TenantsModule } from './tenants/tenants.module';
import { ClientsModule } from './clients/clients.module';
import { CctvModule } from './cctv/cctv.module';
import { RepairsModule } from './repairs/repairs.module';
import { InventoryModule } from './inventory/inventory.module';
import { TicketsModule } from './tickets/tickets.module';
import { ReportsModule } from './reports/reports.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { AmcModule } from './amc/amc.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes the configuration globally available in your app
      envFilePath: [join(process.cwd(), 'config/.env.config'), join(process.cwd(), '.env')],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads', // URL prefix
    }),
    MongooseModule.forRoot(process.env.MONGO_URL_DEV || 'mongodb://68.168.222.14:21007/techservice-app'),
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
    TerminusModule,
    HttpModule.register({
      timeout: 3000,
      maxRedirects: 5,
    }),
    UploadModule,
    ScheduleModule.forRoot(),
    MailModule,
    NotificationsModule,
    TenantsModule,
    ClientsModule,
    CctvModule,
    RepairsModule,
    InventoryModule,
    TicketsModule,
    ReportsModule,
    DashboardModule,
    AmcModule,
  ],
  controllers: [AppController],
  providers: [AppService, RolesGuard, MembershipExpiryTask],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggerMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
