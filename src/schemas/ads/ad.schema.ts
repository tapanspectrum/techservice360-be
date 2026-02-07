// src/ads/schemas/ad.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema({ discriminatorKey: 'category', timestamps: true })
export class Ad extends Document {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ required: true })
  price: number;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  owner: Types.ObjectId;

  @Prop([String])
  images: string[];

  // 👇 Flexible structure for new categories or optional data
  @Prop({ type: Object, default: {} })
  attributes: Record<string, any>;

  // 👇 New fields for average rating and total reviews
  @Prop({ default: 0 })
  avgRating: number;

  @Prop({ default: 0 })
  totalReviews: number;

  @Prop({ default: 0 })
  views: number;

  @Prop({ default: 'active', enum: ['active', 'sold', 'archived'] })
  status: string;

  @Prop({ default: 0 })
  favoritesCount: number;

  @Prop({ default: 0 })
  commentsCount: number;

  @Prop({
    type: {
      city: String,
      state: String,
      country: String,
      coordinates: {
        lat: Number,
        lng: Number,
      },
    },
  })
  location: Record<string, any>;

  // ✅ New field — featured flag
  @Prop({ default: false })
  isFeatured: boolean;

  // ✅ New field — indicates if the ad is for a new item
  @Prop({ default: false })
  isNewAd: boolean;

  // ✅ New field — sales or conversion metric (if relevant)
  @Prop({ default: 0 })
  salesCount: number;

  @Prop({ default: Date.now })
  createdAt: Date;

  @Prop({ default: Date.now })
  updatedAt: Date;
}

export const AdSchema = SchemaFactory.createForClass(Ad);
