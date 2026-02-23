import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { ClientsService } from '../clients/clients.service';
import { AmcService } from '../amc/amc.service';
import { BillingService } from '../billing/billing.service';
import { BillingStatus } from '../billing/billing.constants';
import { TicketsService } from '../tickets/tickets.service';
import { InventoryService } from '../inventory/inventory.service';
import { CctvService } from '../cctv/cctv.service';
import { SuppliersService } from '../suppliers/suppliers.service';
import { InventoryCategory } from '../inventory/inventory.constants';
import { AMCStatus } from '../amc/amc.constants';
import { TicketStatus, TicketPriority } from '../tickets/tickets.constants';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  // Clients
  const clientsService = app.get(ClientsService);
  // Insert 20 dummy clients
  const clientDocs: any[] = [];
  for (let i = 1; i <= 20; i++) {
    const client = await clientsService.create({
      tenantId: 'tenant1',
      name: `Client ${i}`,
      email: `client${i}@example.com`,
      phone: `+9112345678${String(i).padStart(2, '0')}`,
      address: `${i} Main St`,
    });
    clientDocs.push(client);
  }

  // Suppliers
  const suppliersService = app.get(SuppliersService);
  // Insert 20 dummy suppliers
  const supplierDocs: any[] = [];
  for (let i = 1; i <= 20; i++) {
    const supplier = await suppliersService.create({
      tenantId: 'tenant1',
      name: `Supplier ${i}`,
      phone: `+9198765432${String(i).padStart(2, '0')}`,
      creditDays: 30,
      address: `${i} Supplier Ave`,
      role: 'supplier',
      password: 'Password123!',
    });
    supplierDocs.push(supplier);
  }

  // Inventory
  const inventoryService = app.get(InventoryService);
  await inventoryService.create({
    tenantId: 'tenant1',
    productName: 'CCTV Camera',
    category: InventoryCategory.CCTV,
    purchasePrice: 100,
    sellingPrice: 150,
    stock: 10,
    supplierId: String(supplierDocs[0]._id),
  });

  // AMC
  const amcService = app.get(AmcService);
  await amcService.create({
    tenantId: 'tenant1',
    clientId: String(clientDocs[0]._id),
    contractNumber: 'AMC-001',
    startDate: new Date(),
    endDate: new Date(Date.now() + 31536000000),
    amount: 500,
    status: AMCStatus.ACTIVE,
    planType: 'home',
  });

  // Billing
  const billingService = app.get(BillingService);
  await billingService.create({
    tenantId: 'tenant1',
    clientId: String(clientDocs[0]._id),
    amount: 500,
    status: BillingStatus.PAID,
    invoiceNumber: 'INV-001',
    invoiceDate: new Date(),
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  });

  // Tickets
  const ticketsService = app.get(TicketsService);
  await ticketsService.create({
    tenantId: 'tenant1',
    clientId: String(clientDocs[0]._id),
    title: 'Support Needed',
    description: 'Camera not working',
    priority: TicketPriority.MEDIUM,
    status: TicketStatus.OPEN,
  });

  // CCTV
  const cctvService = app.get(CctvService);
  await cctvService.create({
    tenantId: 'tenant1',
    projectName: 'Mall CCTV',
    clientId: String(clientDocs[0]._id),
    cameras: 8,
    amount: 1200,
    installationDate: new Date().toISOString(),
    warranty: '2 years',
    status: 'installed',
  });

  await app.close();
}

bootstrap();
