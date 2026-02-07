// src/ads/schemas/real-estate-ad.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Ad } from './ad.schema';

@Schema()
export class RealEstateAd extends Ad {
  @Prop()
  area: number;

  @Prop()
  bedrooms: number;

  @Prop()
  bathrooms: number;

  @Prop()
  furnishing: string;
}

export const RealEstateAdSchema = SchemaFactory.createForClass(RealEstateAd);
