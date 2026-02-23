import { Test, TestingModule } from '@nestjs/testing';
import { TenantController } from './tenant.controller';
import { TenantService } from './tenant.service';

describe('TenantController', () => {
  let controller: TenantController;
  let service: TenantService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TenantController],
      providers: [
        {
          provide: TenantService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
            findByEmail: jest.fn(),
            findByName: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<TenantController>(TenantController);
    service = module.get<TenantService>(TenantService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a tenant', async () => {
      const createTenantDto = {
        name: 'Test Tenant',
        email: 'test@example.com',
        companyName: 'Test Company',
      };

      jest.spyOn(service, 'create').mockResolvedValueOnce(createTenantDto as any);

      const req = { user: { role: 'admin' } };
      const result = await controller.create(createTenantDto, req);

      expect(result).toEqual(createTenantDto);
      expect(service.create).toHaveBeenCalledWith(createTenantDto);
    });

    it('should throw error if non-admin tries to create', async () => {
      const createTenantDto = {
        name: 'Test Tenant',
        email: 'test@example.com',
        companyName: 'Test Company',
      };

      const req = { user: { role: 'user' } };

      expect(() => controller.create(createTenantDto, req)).toThrow();
    });
  });

  describe('findAll', () => {
    it('should return all tenants for admin', async () => {
      const tenants = [{ _id: '1', name: 'Tenant 1' }];
      jest.spyOn(service, 'findAll').mockResolvedValueOnce(tenants as any);

      const req = { user: { role: 'admin' }, tenantId: null };
      const result = await controller.findAll(req);

      expect(result).toEqual(tenants);
      expect(service.findAll).toHaveBeenCalledWith(null, 'admin');
    });
  });
});
