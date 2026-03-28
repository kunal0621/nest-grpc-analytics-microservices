import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Customer, CustomerDocument } from './schemas/customer.schema';
import {
  GetCustomerRequest,
  GetCustomerResponse,
  CreateCustomerRequest,
  CreateCustomerResponse,
  UpdateCustomerRequest,
  UpdateCustomerResponse,
  ListCustomersRequest,
  ListCustomersResponse,
  AddAccountToCustomerRequest,
  AddAccountToCustomerResponse,
  RemoveAccountFromCustomerRequest,
  RemoveAccountFromCustomerResponse,
  TierAndDetails,
} from '../../analytics-gateway/src/customers/constants/grpc-client.constants';
import { RpcException } from '@nestjs/microservices';
import { status } from '@grpc/grpc-js';

@Injectable()
export class CustomersService {
  constructor(
    @InjectModel(Customer.name)
    private readonly customerModel: Model<CustomerDocument>,
  ) {}

  ping(): { message: string } {
    return { message: 'Customers service is up and running!' };
  }

  async getCustomer(data: GetCustomerRequest): Promise<GetCustomerResponse> {
    try {
      const customer = await this.customerModel
        .findOne({ username: data.username })
        .lean()
        .exec();
      if (!customer) {
        throw new RpcException({
          code: status.NOT_FOUND,
          message: `Customer ${data.username} not found`,
        });
      }
      return {
        username: customer.username,
        name: customer.name,
        address: customer.address,
        birthdate: new Date(customer.birthdate).toISOString(),
        email: customer.email,
        accounts: customer.accounts,
        tier_and_details: customer.tier_and_details as Record<
          string,
          TierAndDetails
        >,
      };
    } catch (error) {
      if (error instanceof RpcException) {
        throw error;
      }
      throw new RpcException({
        code: status.INTERNAL,
        message: 'Internal server error',
      });
    }
  }

  async createCustomer(
    data: CreateCustomerRequest,
  ): Promise<CreateCustomerResponse> {
    try {
      const customer = await this.customerModel.create(data);
      return {
        username: customer.username,
        name: customer.name,
        address: customer.address,
        birthdate: new Date(customer.birthdate).toISOString(),
        email: customer.email,
      };
    } catch (error) {
      if (error instanceof RpcException) {
        throw error;
      }
      throw new RpcException({
        code: status.INTERNAL,
        message: 'Internal server error',
      });
    }
  }

  async updateCustomer(
    data: UpdateCustomerRequest,
  ): Promise<UpdateCustomerResponse> {
    try {
      const customer = await this.customerModel
        .findOneAndUpdate({ username: data.username }, data, { new: true })
        .exec();
      if (!customer) {
        throw new RpcException({
          code: status.NOT_FOUND,
          message: `Customer ${data.username} not found`,
        });
      }
      return {
        username: customer.username,
        name: customer.name,
        address: customer.address,
        birthdate: new Date(customer.birthdate).toISOString(),
        email: customer.email,
      };
    } catch (error) {
      if (error instanceof RpcException) {
        throw error;
      }
      throw new RpcException({
        code: status.INTERNAL,
        message: 'Internal server error',
      });
    }
  }

  async listCustomers(
    data: ListCustomersRequest,
  ): Promise<ListCustomersResponse> {
    try {
      const query = data.cursor ? { username: { $gt: data.cursor } } : {};

      const customers = await this.customerModel
        .find(query)
        .sort({ username: 1 })
        .limit(data.limit)
        .lean()
        .exec();

      const nextCursor =
        customers.length > 0 ? customers[customers.length - 1].username : '';

      return {
        next_cursor: nextCursor,
        customers: customers.map((customer) => ({
          username: customer.username,
          name: customer.name,
          address: customer.address,
          birthdate: new Date(customer.birthdate).toISOString(),
          email: customer.email,
          accounts: customer.accounts,
          tier_and_details: Object.fromEntries(
            Object.entries(customer.tier_and_details || {}).map(
              ([key, value]) => [
                key,
                {
                  tier: value.tier ?? '',
                  benefits: value.benefits ?? [],
                  active: value.active ?? false,
                  id: value.id ?? '',
                },
              ],
            ),
          ),
        })),
      };
    } catch (error) {
      if (error instanceof RpcException) {
        throw error;
      }
      throw new RpcException({
        code: status.INTERNAL,
        message: 'Internal server error',
      });
    }
  }

  async addAccountToCustomer(
    data: AddAccountToCustomerRequest,
  ): Promise<AddAccountToCustomerResponse> {
    try {
      const customer = await this.customerModel
        .findOneAndUpdate(
          { username: data.username },
          { $push: { accounts: data.account_id } },
          { new: true },
        )
        .exec();
      if (!customer) {
        throw new RpcException({
          code: status.NOT_FOUND,
          message: `Customer ${data.username} not found`,
        });
      }
      return {
        username: customer.username,
        account_id: customer.accounts[customer.accounts.length - 1],
      };
    } catch (error) {
      if (error instanceof RpcException) {
        throw error;
      }
      throw new RpcException({
        code: status.INTERNAL,
        message: 'Internal server error',
      });
    }
  }

  async removeAccountFromCustomer(
    data: RemoveAccountFromCustomerRequest,
  ): Promise<RemoveAccountFromCustomerResponse> {
    try {
      const customer = await this.customerModel
        .findOneAndUpdate(
          { username: data.username },
          { $pull: { accounts: data.account_id } },
          { new: true },
        )
        .exec();
      if (!customer) {
        throw new RpcException({
          code: status.NOT_FOUND,
          message: `Customer ${data.username} not found`,
        });
      }
      return {
        username: customer.username,
        account_id: data.account_id,
      };
    } catch (error) {
      if (error instanceof RpcException) {
        throw error;
      }
      throw new RpcException({
        code: status.INTERNAL,
        message: 'Internal server error',
      });
    }
  }
}
