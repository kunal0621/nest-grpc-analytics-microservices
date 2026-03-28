import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CustomerDocument = HydratedDocument<Customer>;

@Schema({ _id: false })
class TierAndDetails {
  @Prop({ trim: true })
  tier: string;

  @Prop({ trim: true })
  benefits: string[];

  @Prop({ trim: true })
  active: boolean;

  @Prop({ trim: true })
  id: string;
}

const TierAndDetailsSchema = SchemaFactory.createForClass(TierAndDetails);

@Schema({ collection: 'customers' })
export class Customer {
  @Prop({ required: true, unique: true, trim: true })
  username: string;

  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ trim: true })
  address: string;

  @Prop()
  birthdate: Date;

  @Prop({ required: true, trim: true, lowercase: true })
  email: string;

  @Prop({ type: [Number], default: [] })
  accounts: number[]; // list of account_id references

  @Prop({ type: Map, of: TierAndDetailsSchema, default: {} })
  tier_and_details: Record<string, TierAndDetails>;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
