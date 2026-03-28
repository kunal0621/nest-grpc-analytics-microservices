import { Observable } from 'rxjs';
import { PingResponse } from '../../health/constants/grpc-client.constants';

export interface CustomerGrpcService {
  ping(data: Record<string, never>): Observable<PingResponse>;

  getCustomer(data: GetCustomerRequest): Observable<GetCustomerResponse>;

  createCustomer(
    data: CreateCustomerRequest,
  ): Observable<CreateCustomerResponse>;

  updateCustomer(
    data: UpdateCustomerRequest,
  ): Observable<UpdateCustomerResponse>;

  listCustomers(data: ListCustomersRequest): Observable<ListCustomersResponse>;

  addAccountToCustomer(
    data: AddAccountToCustomerRequest,
  ): Observable<AddAccountToCustomerResponse>;

  removeAccountFromCustomer(
    data: RemoveAccountFromCustomerRequest,
  ): Observable<RemoveAccountFromCustomerResponse>;
}

export interface GetCustomerRequest {
  username: string;
}

export interface GetCustomerResponse {
  username: string;
  name: string;
  address: string;
  birthdate: string;
  email: string;
  accounts: number[];
  tier_and_details: Record<string, TierAndDetails>;
}

export interface TierAndDetails {
  tier: string;
  benefits: string[];
  active: boolean;
  id: string;
}

export interface CreateCustomerRequest {
  username: string;
  name: string;
  address: string;
  birthdate: string;
  email: string;
}

export interface CreateCustomerResponse {
  username: string;
  name: string;
  address: string;
  birthdate: string;
  email: string;
}

export interface UpdateCustomerRequest {
  username: string;
  name: string;
  address: string;
  birthdate: string;
  email: string;
}

export interface UpdateCustomerResponse {
  username: string;
  name: string;
  address: string;
  birthdate: string;
  email: string;
}

export interface ListCustomersRequest {
  limit: number;
  cursor?: string;
}

export interface ListCustomersResponse {
  next_cursor: string;
  customers: Customer[];
}

export interface AddAccountToCustomerRequest {
  username: string;
  account_id: number;
}

export interface AddAccountToCustomerResponse {
  username: string;
  account_id: number;
}

export interface RemoveAccountFromCustomerRequest {
  username: string;
  account_id: number;
}

export interface RemoveAccountFromCustomerResponse {
  username: string;
  account_id: number;
}

export interface Customer {
  username: string;
  name: string;
  address: string;
  birthdate: string;
  email: string;
  accounts: number[];
  tier_and_details: Record<string, TierAndDetails>;
}
