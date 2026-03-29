import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CustomerService } from '../customer.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { PingResponse } from '../../health/constants/grpc-client.constants';
import {
  GetCustomerResponse,
  RemoveAccountFromCustomerResponse,
  CreateCustomerResponse,
  UpdateCustomerResponse,
  type ListCustomersResponse,
  type AddAccountToCustomerResponse,
} from '../constants/grpc-client.constants';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { UpdateCustomerDto } from '../dto/update-customer.dto';
import { ListCustomersDto } from '../dto/list-customers.dto';
import { AddAccountDto } from '../dto/add-account.dto';

@ApiTags('Customers')
@Controller()
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get('customers/ping')
  @ApiOperation({ summary: 'Ping the Customers microservice' })
  @ApiResponse({ status: 200, description: 'Customers service is reachable.' })
  pingCustomers(): Observable<PingResponse> {
    return this.customerService.pingCustomers();
  }

  @Get('customers/:username')
  @ApiOperation({ summary: 'Get a customer by username' })
  @ApiResponse({ status: 200, description: 'Customer found.' })
  @ApiResponse({ status: 404, description: 'Customer not found.' })
  getCustomer(
    @Param('username') username: string,
  ): Observable<GetCustomerResponse> {
    return this.customerService.getCustomer({ username });
  }

  @Post('customers')
  @ApiOperation({ summary: 'Create a customer' })
  @ApiResponse({ status: 201, description: 'Customer created.' })
  createCustomer(
    @Body() data: CreateCustomerDto,
  ): Observable<CreateCustomerResponse> {
    return this.customerService.createCustomer(data);
  }

  @Put('customers/:username')
  @ApiOperation({ summary: 'Update a customer by username' })
  @ApiResponse({ status: 200, description: 'Customer updated.' })
  @ApiResponse({ status: 404, description: 'Customer not found.' })
  updateCustomer(
    @Param('username') username: string,
    @Body() data: UpdateCustomerDto,
  ): Observable<UpdateCustomerResponse> {
    return this.customerService.updateCustomer({ ...data, username });
  }

  @Get('customers')
  @ApiOperation({ summary: 'List customers' })
  @ApiResponse({ status: 200, description: 'List of customers.' })
  listCustomers(
    @Query() query: ListCustomersDto,
  ): Observable<ListCustomersResponse> {
    return this.customerService.listCustomers({
      limit: query.limit,
      cursor: query.cursor,
    });
  }

  @Post('customers/:username/accounts')
  @ApiOperation({ summary: 'Add an account to a customer' })
  @ApiResponse({ status: 200, description: 'Account added to customer.' })
  @ApiResponse({ status: 404, description: 'Customer not found.' })
  addAccountToCustomer(
    @Param('username') username: string,
    @Body() data: AddAccountDto,
  ): Observable<AddAccountToCustomerResponse> {
    return this.customerService.addAccountToCustomer({
      username,
      account_id: data.account_id,
    });
  }

  @Delete('customers/:username/accounts/:account_id')
  @ApiOperation({ summary: 'Remove an account from a customer' })
  @ApiResponse({ status: 200, description: 'Account removed from customer.' })
  @ApiResponse({ status: 404, description: 'Customer or account not found.' })
  removeAccountFromCustomer(
    @Param('username') username: string,
    @Param('account_id') account_id: number,
  ): Observable<RemoveAccountFromCustomerResponse> {
    return this.customerService.removeAccountFromCustomer({
      username,
      account_id,
    });
  }
}
