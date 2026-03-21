import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import * as bcrypt from 'bcryptjs';

export interface UserDocument extends Document {
  name: string;
  email: string;
  password: string;
  dob?: string;
  role: string;
  tenantId?: Types.ObjectId;
  clientId?: Types.ObjectId;
  phone?: string;
  address?: string;
  avatar?: string;
  isVerified?: boolean;
  favorites: Types.ObjectId[];

  matchPassword(enteredPassword: string): Promise<boolean>; // 👈 declare here
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({type: String })
  dob?: string;

  @Prop({
    type: String,
    enum: ['admin', 'tech', 'client', 'supplier', 'user', 'tenant'],
    default: 'user',
  })
  role: string;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  tenantId?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  clientId?: Types.ObjectId;

  @Prop()
  phone?: string;

  @Prop()
  address?: string;

  @Prop()
  avatar?: string;

  @Prop({ default: false })
  isVerified: boolean;

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

// Index for geospatial queries
UserSchema.index({ location: '2dsphere' });

// Middleware to hash password
UserSchema.pre<UserDocument>('save', async function (next) {
  if (this.dob) {
    const dobDate = new Date(this.dob);

    if (Number.isNaN(dobDate.getTime())) {
      return next(new Error('Invalid date of birth.'));
    }

    const today = new Date();
    const minAgeDate = new Date(
      today.getFullYear() - 8,
      today.getMonth(),
      today.getDate(),
    );

    if (dobDate >= minAgeDate) {
      return next(new Error('User must be older than 8 years.'));
    }
  }

  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});
