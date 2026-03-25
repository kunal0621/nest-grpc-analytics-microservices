import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AccountDocument = HydratedDocument<Account>;

/**
 * Cross-service relationship (resolved via gRPC, not Mongoose populate):
 *   Account.account_id  ←──(1:N)──  Transaction.account_id
 *
 * account_id is the logical primary key shared across the accounts and
 * transactions databases. Lookups across services are performed through
 * the gRPC AccountService / TransactionService, not via Mongoose refs.
 */
@Schema({ collection: 'accounts' })
export class Account {
  /** Logical primary key — referenced as Transaction.account_id */
  @Prop({ required: true, unique: true, index: true })
  account_id: number;

  @Prop({ required: true })
  limit: number;

  @Prop({ type: [String], default: [] })
  products: string[];
}

export const AccountSchema = SchemaFactory.createForClass(Account);
