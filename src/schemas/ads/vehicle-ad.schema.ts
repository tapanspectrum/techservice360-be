// src/ads/schemas/vehicle-ad.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Ad } from './ad.schema';

@Schema()
export class VehicleAd extends Ad {
  @Prop({ required: true })
  make: string;

  @Prop({ required: true })
  vehiclemodel: string;

  @Prop()
  year: number;

  @Prop({ enum: ['petrol', 'diesel', 'electric', 'hybrid'], default: 'petrol' })
  fuelType: string;

  @Prop()
  mileage: number;
}

export const VehicleAdSchema = SchemaFactory.createForClass(VehicleAd);
