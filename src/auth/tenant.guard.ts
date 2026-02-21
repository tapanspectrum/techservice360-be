import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

// Extend Express Request type to include user and tenantId
declare module 'express-serve-static-core' {
  interface Request {
    user?: any;
    tenantId?: string;
  }
}

@Injectable()
export class TenantGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();
    // Try to extract tenantId from JWT payload or header
    const user = request.user as any;
    console.log('TenantGuard - User:', user);
    // If user is admin, skip tenantId check
    if (user && user.role === 'admin') {
      request.tenantId = undefined;
      return true;
    }
    let tenantId = user?.tenantId;
    if (!tenantId) {
      tenantId = request.headers['x-tenant-id'] as string;
    }
    if (!tenantId) {
      throw new Error('tenantId not found in user or headers');
    }
    // Attach tenantId to request for controllers/services
    request.tenantId = tenantId;
    return true;
  }
}
