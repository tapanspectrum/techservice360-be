// seed.ts
import mongoose from 'mongoose';
import { UserSchema } from '../user/schemas/user.schema';
import { AmcSchema } from '../amc/schemas/amc.schema';
import { BillingSchema } from '../billing/schemas/billing.schema';
import { NotificationSchema } from '../notifications/schemas/notification.schema';
import { ProjectSchema } from '../projects/schemas/project.schema';
import { InventorySchema } from '../inventory/schemas/inventory.schema';
import { TicketSchema } from '../tickets/schemas/ticket.schema';
import { RepairSchema } from '../repairs/schemas/repair.schema';
import { DashboardSchema } from '../dashboard/schemas/dashboard.schema';
import { CctvSchema } from '../cctv/schemas/cctv.schema';

const User = mongoose.model('User', UserSchema);
const Amc = mongoose.model('Amc', AmcSchema);
const Billing = mongoose.model('Billing', BillingSchema);
const Notification = mongoose.model('Notification', NotificationSchema);
const Project = mongoose.model('Project', ProjectSchema);
const Inventory = mongoose.model('Inventory', InventorySchema);
const Ticket = mongoose.model('Ticket', TicketSchema);
const Repair = mongoose.model('Repair', RepairSchema);
const Dashboard = mongoose.model('Dashboard', DashboardSchema);
const Cctv = mongoose.model('Cctv', CctvSchema);

const MONGO_URL = process.env.MONGO_URL_DEV || 'mongodb://68.168.222.14:21007/techservice';

async function seed() {
  await mongoose.connect(MONGO_URL);

  // Helper to generate dummy data
  const dummyArr = (fn: (i: number) => any) => Array.from({ length: 20 }, (_, i) => fn(i));

  // User
  await User.deleteMany({});
  await User.insertMany(dummyArr(i => ({
    tenantId: `tenant${i}`,
    name: `User ${i}`,
    email: `user${i}@example.com`,
    password: 'Password123!',
    role: 'user',
    phone: `+9100000000${i}`,
    address: `Address ${i}`,
    location: { type: 'Point', coordinates: [77.5 + i * 0.01, 12.9 + i * 0.01] },
    membership: 'free',
    isVerified: true,
    favorites: [],
  })));

  // Amc
  await Amc.deleteMany({});
  await Amc.insertMany(dummyArr(i => ({
    tenantId: `tenant${i}`,
    clientId: `client${i}`,
    contractNumber: `CN${1000 + i}`,
    startDate: new Date(2023, 0, 1 + i),
    endDate: new Date(2024, 0, 1 + i),
    amount: 1000 + i * 10,
    description: `AMC contract for client${i}`,
    status: ['active', 'expired', 'pending', 'cancelled'][i % 4],
    planType: ['home', '5pc', '10pc', '20pc'][i % 4],
    scope: `Scope for AMC ${i}`,
    terms: `Terms for AMC ${i}`
  })));

  // Billing
  await Billing.deleteMany({});
  await Billing.insertMany(dummyArr(i => ({ amount: 100 + i, description: `Bill ${i}` })));


  // Notification
  await Notification.deleteMany({});
  await Notification.insertMany(dummyArr(i => ({ message: `Notification ${i}` })));

  // Project
  await Project.deleteMany({});
  await Project.insertMany(dummyArr(i => ({ name: `Project ${i}` })));

  // Inventory
  await Inventory.deleteMany({});
  await Inventory.insertMany(dummyArr(i => ({
    tenantId: `tenant${i}`,
    productName: `Product ${i}`,
    category: ['cctv', 'hardware', 'spare'][i % 3],
    purchasePrice: 100 + i * 5,
    sellingPrice: 120 + i * 5,
    stock: 10 + i,
    supplierId: new mongoose.Types.ObjectId(),
  })));

  // Ticket
  await Ticket.deleteMany({});
  await Ticket.insertMany(dummyArr(i => ({ title: `Ticket ${i}` })));

  // Repair
  await Repair.deleteMany({});
  await Repair.insertMany(dummyArr(i => ({
    tenantId: `tenant${i}`,
    clientId: new mongoose.Types.ObjectId(),
    deviceType: ['laptop', 'printer', 'cctv'][i % 3],
    issue: `Issue description ${i}`,
    amount: 200 + i * 10,
    status: ['pending', 'in-progress', 'completed'][i % 3],
  })));

  // Dashboard
  await Dashboard.deleteMany({});
  await Dashboard.insertMany(dummyArr(i => ({
    tenantId: `tenant${i}`,
    title: `Dashboard ${i}`,
  })));

  // Cctv
  await Cctv.deleteMany({});
  await Cctv.insertMany(dummyArr(i => ({
    tenantId: `tenant${i}`,
    clientId: new mongoose.Types.ObjectId(),
    projectName: `Project ${i}`,
    cameras: 4 + (i % 8),
    amount: 5000 + i * 100,
    installationDate: new Date(2023, 5, 1 + i),
    warranty: `${12 + (i % 12)} months`,
    status: ['installed', 'pending'][i % 2],
  })));


  console.log('Dummy data inserted for all collections!');
  await mongoose.disconnect();
}

seed().catch(e => { console.error(e); process.exit(1); });
