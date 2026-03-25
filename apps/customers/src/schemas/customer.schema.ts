import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type CustomerDocument = HydratedDocument<Customer>;

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

  @Prop({ type: MongooseSchema.Types.Mixed, default: {} })
  tier_and_details: Record<string, unknown>;
}

export const CustomerSchema = SchemaFactory.createForClass(Customer);
