import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { TenantService } from './tenant.service';
import { Tenant } from './schemas/tenant.schema';

describe('TenantService', () => {
  let service: TenantService;
  let mockTenantModel: any;

  beforeEach(async () => {
    mockTenantModel = {
      create: jest.fn(),
      find: jest.fn().mockReturnValue({
        exec: jest.fn(),
      }),
      findOne: jest.fn().mockReturnValue({
        exec: jest.fn(),
      }),
      findOneAndUpdate: jest.fn().mockReturnValue({
        exec: jest.fn(),
      }),
      findOneAndDelete: jest.fn().mockReturnValue({
        exec: jest.fn(),
      }),
      findByIdAndUpdate: jest.fn().mockReturnValue({
        exec: jest.fn(),
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TenantService,
        {
          provide: getModelToken(Tenant.name),
          useValue: mockTenantModel,
        },
      ],
    }).compile();

    service = module.get<TenantService>(TenantService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a tenant', async () => {
      const createTenantDto = {
        name: 'Test Tenant',
        email: 'test@example.com',
        companyName: 'Test Company',
      };

      const mockTenant = { ...createTenantDto, _id: '123', save: jest.fn() };
      mockTenant.save.mockResolvedValue(mockTenant);

      jest.spyOn(mockTenantModel, 'constructor' as any).mockReturnValueOnce(mockTenant);

      // Implementation note: The actual service creates an instance and saves it
      // This is a basic test structure that can be expanded
    });
  });

  describe('findAll', () => {
    it('should return all tenants', async () => {
      const tenants = [{ _id: '1', name: 'Tenant 1' }];
      mockTenantModel.find().exec.mockResolvedValueOnce(tenants);

      const result = await service.findAll();

      expect(result).toEqual(tenants);
    });

    it('should filter by tenantId for non-admin', async () => {
      const tenants = [{ _id: '1', name: 'Tenant 1' }];
      mockTenantModel.find().exec.mockResolvedValueOnce(tenants);

      const result = await service.findAll('tenant-123', 'user');

      expect(result).toEqual(tenants);
    });
  });

  describe('findOne', () => {
    it('should find a tenant by id', async () => {
      const tenant = { _id: '1', name: 'Tenant 1' };
      mockTenantModel.findOne().exec.mockResolvedValueOnce(tenant);

      const result = await service.findOne('1');

      expect(result).toEqual(tenant);
    });
  });

  describe('update', () => {
    it('should update a tenant', async () => {
      const updateTenantDto = { name: 'Updated Tenant' };
      const tenant = { _id: '1', name: 'Updated Tenant' };
      mockTenantModel.findOneAndUpdate().exec.mockResolvedValueOnce(tenant);

      const result = await service.update('1', updateTenantDto);

      expect(result).toEqual(tenant);
    });
  });

  describe('remove', () => {
    it('should remove a tenant', async () => {
      const tenant = { _id: '1', name: 'Tenant 1' };
      mockTenantModel.findOneAndDelete().exec.mockResolvedValueOnce(tenant);

      const result = await service.remove('1');

      expect(result).toEqual(tenant);
    });
  });

  describe('updateUserCount', () => {
    it('should increment user count', async () => {
      const tenant = { _id: '1', currentUsers: 2 };
      mockTenantModel.findByIdAndUpdate().exec.mockResolvedValueOnce(tenant);

      const result = await service.updateUserCount('1', 1);

      expect(result).toEqual(tenant);
    });
  });

  describe('updateStorageUsage', () => {
    it('should increment storage usage', async () => {
      const tenant = { _id: '1', usedStorage: 1024 };
      mockTenantModel.findByIdAndUpdate().exec.mockResolvedValueOnce(tenant);

      const result = await service.updateStorageUsage('1', 1024);

      expect(result).toEqual(tenant);
    });
  });
});
