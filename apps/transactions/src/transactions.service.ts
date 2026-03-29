import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';
import {
  Transaction,
  TransactionDocument,
  TransactionEntry,
} from './schemas/transaction.schema';
import {
  RecordTransactionRequest,
  RecordTransactionResponse,
  GetTransactionsByAccountRequest,
  GetTransactionsByAccountResponse,
  TransactionBucketDto,
  GetTransactionsBySymbolRequest,
  GetTransactionsBySymbolResponse,
  GetTransactionBucketSummaryRequest,
  GetTransactionBucketSummaryResponse,
} from 'apps/analytics-gateway/src/transactions/constants/grpc-client.constants';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name)
    private readonly transactionModel: Model<TransactionDocument>,
  ) {}

  ping(): { message: string } {
    return { message: 'Transactions service is up and running!' };
  }

  async recordTransaction(
    data: RecordTransactionRequest,
  ): Promise<RecordTransactionResponse> {
    try {
      const now = new Date();
      const bucketStart = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
      );
      const bucketEnd = new Date(bucketStart);
      bucketEnd.setDate(bucketEnd.getDate() + 1);

      // Validate input
      if (!data.symbol || !data.transaction_code || data.amount <= 0) {
        throw new RpcException({
          code: status.INVALID_ARGUMENT,
          message:
            'Invalid transaction data: symbol, transaction_code, and positive amount are required',
        });
      }

      // Calculate total
      const priceNum = parseFloat(data.price);
      if (isNaN(priceNum) || priceNum <= 0) {
        throw new RpcException({
          code: status.INVALID_ARGUMENT,
          message: 'Invalid price: must be a positive number',
        });
      }
      const total = (data.amount * priceNum).toFixed(2);

      const transactionEntry: Partial<TransactionEntry> = {
        date: now,
        amount: data.amount,
        transaction_code: data.transaction_code,
        symbol: data.symbol.toLowerCase(),
        price: data.price,
        total,
      };

      // Try to find existing bucket for today
      let bucket = await this.transactionModel.findOne({
        account_id: data.account_id,
        bucket_start_date: bucketStart,
        bucket_end_date: bucketEnd,
      });

      if (bucket) {
        // Add to existing bucket
        bucket.transactions.push(transactionEntry as TransactionEntry);
        bucket.transaction_count += 1;
        await bucket.save();
      } else {
        // Create new bucket
        bucket = new this.transactionModel({
          account_id: data.account_id,
          transaction_count: 1,
          bucket_start_date: bucketStart,
          bucket_end_date: bucketEnd,
          transactions: [transactionEntry as TransactionEntry],
        });
        await bucket.save();
      }

      return { success: true, bucket_id: bucket._id.toString() };
    } catch (error) {
      throw this.toRpcException(
        error,
        'Failed to record transaction',
        status.INTERNAL,
      );
    }
  }

  async getTransactionsByAccount(
    data: GetTransactionsByAccountRequest,
  ): Promise<GetTransactionsByAccountResponse> {
    try {
      const query: {
        account_id: number;
        bucket_start_date?: { $gte?: Date; $lte?: Date };
      } = { account_id: data.account_id };

      if (data.start_date || data.end_date) {
        query.bucket_start_date = {};
        if (data.start_date) {
          const startDate = new Date(data.start_date);
          if (isNaN(startDate.getTime())) {
            throw new RpcException({
              code: status.INVALID_ARGUMENT,
              message: 'Invalid start_date format',
            });
          }
          query.bucket_start_date.$gte = startDate;
        }
        if (data.end_date) {
          const endDate = new Date(data.end_date);
          if (isNaN(endDate.getTime())) {
            throw new RpcException({
              code: status.INVALID_ARGUMENT,
              message: 'Invalid end_date format',
            });
          }
          query.bucket_start_date.$lte = endDate;
        }
      }

      const buckets = await this.transactionModel
        .find(query)
        .sort({ bucket_start_date: -1 })
        .lean()
        .exec();

      const bucketDtos: TransactionBucketDto[] = buckets.map((bucket) => ({
        account_id: bucket.account_id,
        transaction_count: bucket.transaction_count,
        bucket_start_date: bucket.bucket_start_date,
        bucket_end_date: bucket.bucket_end_date,
        transactions: bucket.transactions.map((t) => ({
          date: t.date,
          amount: t.amount,
          transaction_code: t.transaction_code,
          symbol: t.symbol,
          price: t.price,
          total: t.total,
        })),
      }));

      return { buckets: bucketDtos };
    } catch (error) {
      throw this.toRpcException(
        error,
        'Failed to retrieve transactions',
        status.INTERNAL,
      );
    }
  }

  async getTransactionsBySymbol(
    data: GetTransactionsBySymbolRequest,
  ): Promise<GetTransactionsBySymbolResponse> {
    try {
      if (!data.symbol) {
        throw new RpcException({
          code: status.INVALID_ARGUMENT,
          message: 'Symbol is required',
        });
      }

      const buckets = await this.transactionModel
        .find({
          account_id: data.account_id,
          'transactions.symbol': data.symbol.toLowerCase(),
        })
        .sort({ bucket_start_date: -1 })
        .lean()
        .exec();

      const bucketDtos: TransactionBucketDto[] = buckets.map((bucket) => ({
        account_id: bucket.account_id,
        transaction_count: bucket.transaction_count,
        bucket_start_date: bucket.bucket_start_date,
        bucket_end_date: bucket.bucket_end_date,
        transactions: bucket.transactions
          .filter((t) => t.symbol === data.symbol.toLowerCase())
          .map((t) => ({
            date: t.date,
            amount: t.amount,
            transaction_code: t.transaction_code,
            symbol: t.symbol,
            price: t.price,
            total: t.total,
          })),
      }));

      return { buckets: bucketDtos };
    } catch (error) {
      throw this.toRpcException(
        error,
        'Failed to retrieve transactions by symbol',
        status.INTERNAL,
      );
    }
  }

  async getTransactionBucketSummary(
    data: GetTransactionBucketSummaryRequest,
  ): Promise<GetTransactionBucketSummaryResponse> {
    try {
      const buckets = await this.transactionModel
        .find({ account_id: data.account_id })
        .select('transaction_count bucket_start_date bucket_end_date')
        .sort({ bucket_start_date: 1 })
        .lean()
        .exec();

      if (buckets.length === 0) {
        return {
          account_id: data.account_id,
          total_buckets: 0,
          total_transactions: 0,
          date_range: {
            earliest: new Date(),
            latest: new Date(),
          },
        };
      }

      const totalTransactions = buckets.reduce(
        (sum, bucket) => sum + bucket.transaction_count,
        0,
      );

      return {
        account_id: data.account_id,
        total_buckets: buckets.length,
        total_transactions: totalTransactions,
        date_range: {
          earliest: buckets[0].bucket_start_date,
          latest: buckets[buckets.length - 1].bucket_end_date,
        },
      };
    } catch (error) {
      throw this.toRpcException(
        error,
        'Failed to retrieve transaction summary',
        status.INTERNAL,
      );
    }
  }

  private toRpcException(
    error: unknown,
    context: string,
    fallbackCode: number,
  ): RpcException {
    if (error instanceof RpcException) {
      return error;
    }

    return new RpcException({
      code: fallbackCode,
      message: `${context}: ${error instanceof Error ? error.message : 'Unknown error'}`,
    });
  }
}
