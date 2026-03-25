import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

// ── Nested subdocument ──────────────────────────────────────────────────────
@Schema({ _id: false })
export class TransactionEntry {
  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true, trim: true })
  transaction_code: string; // 'buy' | 'sell'

  @Prop({ required: true, trim: true })
  symbol: string;

  @Prop({ required: true })
  price: string; // stored as high-precision decimal string

  @Prop({ required: true })
  total: string; // stored as high-precision decimal string
}

export const TransactionEntrySchema =
  SchemaFactory.createForClass(TransactionEntry);

// ── Top-level document ──────────────────────────────────────────────────────
export type TransactionDocument = HydratedDocument<Transaction>;

/**
 * Cross-service relationship (resolved via gRPC, not Mongoose populate):
 *   Transaction.account_id  ──(N:1)──►  Account.account_id
 *
 * account_id is a logical foreign key pointing to an Account document in the
 * separate accounts database. Because each microservice owns its own MongoDB
 * connection, cross-collection joins are handled at the service layer by
 * calling the AccountService over gRPC (not via Mongoose refs/populate).
 *
 * The field is indexed here to support efficient lookup of all transaction
 * buckets belonging to a given account.
 */
@Schema({ collection: 'transactions' })
export class Transaction {
  /**
   * Logical foreign key → Account.account_id
   * Indexed for efficient per-account transaction queries.
   */
  @Prop({ required: true, index: true })
  account_id: number;

  @Prop({ required: true })
  transaction_count: number;

  @Prop({ required: true })
  bucket_start_date: Date;

  @Prop({ required: true })
  bucket_end_date: Date;

  @Prop({ type: [TransactionEntrySchema], default: [] })
  transactions: TransactionEntry[];
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
