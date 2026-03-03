import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as bcrypt from 'bcryptjs';

export interface UserDocument extends Document {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'tech' | 'client' | 'supplier' | 'user';
  phone?: string;
  address?: string;
  avatar?: string;
  isVerified?: boolean;
  location: {
    type: string;
    coordinates: number[];
  };
  membership: string;
  membershipExpiresAt?: Date;
  favorites: Types.ObjectId[];

  matchPassword(enteredPassword: string): Promise<boolean>; // 👈 declare here
}

@Schema({ timestamps: true })
export class User {
  @Prop({ type: String, required: false, index: true }) // required handled in pre-save
  tenantId?: string;
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({
    type: String,
    enum: ['admin', 'tech', 'client', 'supplier', 'user'],
    default: 'client',
  })
  role: string;

  @Prop()
  phone?: string;

  @Prop()
  address?: string;

  @Prop()
  avatar?: string;

  @Prop({ default: false })
  isVerified: boolean;

  @Prop({
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      default: [0, 0],
    },
  })
  location: {
    type: string;
    coordinates: number[];
  };

  @Prop({
    type: String,
    enum: ['free', 'premium', 'top'],
    default: 'free',
  })
  membership: string; // 🚀 determines priority

  @Prop({ type: Date, default: null })
  membershipExpiresAt?: Date | null; // 🕓 expiry date for paid tiers

  // ❤️ List of ads this user has favorited
  @Prop({ type: [{ type: Types.ObjectId, ref: 'Ad' }], default: [] })
  favorites: Types.ObjectId[];
}

export const UserSchema = SchemaFactory.createForClass(User);

// Hide password automatically when converting to JSON
UserSchema.set('toJSON', {
  transform: (doc, ret: { password?: string }) => {
    delete ret.password; // 👈 removes password
    return ret;
  },
});

// Hide password also in toObject if you ever use it
UserSchema.set('toObject', {
  transform: (doc, ret: { password?: string }) => {
    delete ret.password;
    return ret;
  },
});


// Attach matchPassword method
UserSchema.methods.matchPassword = async function (
  enteredPassword: string,
): Promise<boolean> {
  return bcrypt.compare(enteredPassword, this.password);
};

// Custom validation: tenantId required unless role is 'admin'
UserSchema.pre<UserDocument>('save', function (next) {
  const skipTenantValidation = Boolean((this as UserDocument & { $locals?: { skipTenantValidation?: boolean } }).$locals?.skipTenantValidation);
  if (skipTenantValidation) {
    return next();
  }

  const role = this.get('role');
  const tenantId = this.get('tenantId');
  if (role !== 'admin' && (!tenantId || tenantId === '')) {
    return next(new Error('tenantId is required unless role is admin'));
  }
  next();
});

// Index for geospatial queries
UserSchema.index({ location: '2dsphere' });

// Middleware to hash password
UserSchema.pre<UserDocument>('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
