/* eslint-disable @typescript-eslint/no-empty-object-type */
import type { AccountDto } from '../../accounts/constants/grpc-client.constants';
import type { GetCustomerResponse } from '../constants/grpc-client.constants';

export interface CustomerSummary extends GetCustomerResponse {}

export interface AccountSummary extends AccountDto {}

export interface RecentTransaction {
  date: string;
  amount: number;
  transaction_code: string;
  symbol: string;
  price: string;
  total: string;
}

export interface CustomerOverviewResponse {
  customer: CustomerSummary;
  accounts: AccountSummary[];
  recentTransactionsByAccount: Record<string, RecentTransaction[]>;
}
