import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Inject,
  LoggerService,
} from '@nestjs/common';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import mongoose from 'mongoose';
import { MongoServerError } from 'mongodb';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: LoggerService,
  ) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: any = 'Internal server error';
    let errorType = (exception as any)?.name || 'UnknownError';

    // ✅ 1. Handle NestJS HttpExceptions
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      message = typeof res === 'string' ? res : (res as any).message || res;
      errorType = exception.name;
    }

    // ✅ 2. Handle Mongoose Validation Errors
    else if (exception instanceof mongoose.Error.ValidationError) {
      status = HttpStatus.BAD_REQUEST;
      message = Object.values(exception.errors).map((err: any) => err.message);
      errorType = 'ValidationError';
    }

    // ✅ 3. Handle Invalid ObjectId CastError (common case!)
    else if ((exception as any).name === 'CastError') {
      status = HttpStatus.BAD_REQUEST;
      message = `Invalid ID format: ${(exception as any).value}`;
      errorType = 'CastError';
    }

    // ✅ 4. Handle MongoDB Duplicate Key Errors (E11000)
    else if (exception instanceof MongoServerError && exception.code === 11000) {
      status = HttpStatus.CONFLICT; // 409 Conflict
      const key = Object.keys(exception.keyValue || {})[0];
      message = key
        ? `Duplicate value for field "${key}": ${exception.keyValue[key]}`
        : 'Duplicate key error';
      errorType = 'MongoServerError';
    }

    // ✅ 5. Handle generic JS Errors
    else if (exception instanceof Error) {
      message = exception.message || message;
      errorType = exception.name || 'Error';
    }

    // 🧾 6. Log with Winston (structured)
    this.logger.error(
      `Status: ${status} | Type: ${errorType} | Message: ${JSON.stringify(message)}`,
      (exception as any).stack,
      request.url,
    );

    // 🧭 7. Send standardized JSON response
    response.status(status).json({
      statusCode: status,
      error: errorType,
      message,
      path: request.url,
      timestamp: new Date().toISOString(),
    });
  }
}
