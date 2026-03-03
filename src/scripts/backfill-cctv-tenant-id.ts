import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { CctvService } from '../cctv/cctv.service';
import { ClientsService } from '../clients/clients.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    const cctvService = app.get(CctvService);
    const clientsService = app.get(ClientsService);

    const cctvWithoutTenant = await cctvService.model
      .find(
        {
          $or: [{ tenantId: { $exists: false } }, { tenantId: null }, { tenantId: '' }],
        },
        { _id: 1, clientId: 1 },
      )
      .lean()
      .exec();

    if (cctvWithoutTenant.length === 0) {
      console.log('No CCTV records need tenantId backfill.');
      return;
    }

    const clientIds = Array.from(
      new Set(cctvWithoutTenant.map((item) => String(item.clientId)).filter(Boolean)),
    );

    const clients = await clientsService.model
      .find({ _id: { $in: clientIds } }, { _id: 1, tenantId: 1 })
      .lean()
      .exec();

    const tenantByClientId = new Map(
      clients
        .filter((client) => Boolean(client.tenantId))
        .map((client) => [String(client._id), String(client.tenantId)]),
    );

    const updateOps: Array<{
      updateOne: {
        filter: { _id: unknown };
        update: { $set: { tenantId: string } };
      };
    }> = [];

    for (const record of cctvWithoutTenant) {
      const tenantId = tenantByClientId.get(String(record.clientId));
      if (!tenantId) {
        continue;
      }

      updateOps.push({
        updateOne: {
          filter: { _id: record._id },
          update: { $set: { tenantId } },
        },
      });
    }

    if (updateOps.length === 0) {
      console.log('No matching client tenantId values found to backfill CCTV records.');
      return;
    }

    const result = await cctvService.model.bulkWrite(updateOps);

    console.log(`CCTV tenantId backfill complete. Matched: ${result.matchedCount}, Modified: ${result.modifiedCount}`);
  } finally {
    await app.close();
  }
}

bootstrap().catch((error) => {
  console.error('Failed to backfill CCTV tenantId values:', error);
  process.exit(1);
});
