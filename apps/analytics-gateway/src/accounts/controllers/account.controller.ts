import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  ParseIntPipe,
  Query,
  Param,
  Body,
} from '@nestjs/common';
import { AccountService } from '../account.service';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
  ApiBody,
} from '@nestjs/swagger';
import { Observable } from 'rxjs';
import { PingResponse } from '../../health/constants/grpc-client.constants';
import {
  GetAccountsResponse,
  CreateAccountResponse,
  GetAccountByIdResponse,
  UpdateAccountLimitResponse,
  AddProductToAccountResponse,
  RemoveProductFromAccountResponse,
} from '../constants/grpc-client.constants';
import { GetAccountsDto } from '../dto/get-accounts.dto';
import { CreateAccountDto } from '../dto/create-account.dto';
import { UpdateAccountLimitDto } from '../dto/update-account-limit.dto';
import { AddProductToAccountDto } from '../dto/add-product-to-account.dto';

@ApiTags('Accounts')
@Controller()
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Get('accounts/ping')
  @ApiOperation({ summary: 'Ping the Accounts microservice via gRPC' })
  @ApiResponse({ status: 200, description: 'Accounts service is reachable.' })
  pingAccounts(): Observable<PingResponse> {
    return this.accountService.pingAccounts();
  }

  @Get('accounts')
  @ApiOperation({ summary: 'Fetch all accounts with a limit filter' })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Limit to numbers <= 9000',
    example: 9000,
  })
  @ApiResponse({
    status: 200,
    description: 'List of accounts matching the limit filter.',
  })
  getAccounts(@Query() query: GetAccountsDto): Observable<GetAccountsResponse> {
    return this.accountService.getAccounts(query.limit ?? 9000);
  }

  @Post('accounts')
  @ApiOperation({ summary: 'Create a new account' })
  @ApiBody({ type: CreateAccountDto })
  @ApiResponse({
    status: 201,
    description: 'Account created successfully.',
  })
  @ApiResponse({
    status: 400,
    description: 'Account already exists or invalid data.',
  })
  createAccount(
    @Body() data: CreateAccountDto,
  ): Observable<CreateAccountResponse> {
    return this.accountService.createAccount(data);
  }

  @Get('accounts/:account_id')
  @ApiOperation({ summary: 'Get account by ID' })
  @ApiParam({
    name: 'account_id',
    type: Number,
    description: 'Account ID',
    example: 12345,
  })
  @ApiResponse({
    status: 200,
    description: 'Account details retrieved successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'Account not found.',
  })
  getAccountById(
    @Param('account_id', ParseIntPipe) account_id: number,
  ): Observable<GetAccountByIdResponse> {
    return this.accountService.getAccountById(account_id);
  }

  @Patch('accounts/:account_id/limit')
  @ApiOperation({ summary: 'Update account trading limit' })
  @ApiParam({
    name: 'account_id',
    type: Number,
    description: 'Account ID',
    example: 12345,
  })
  @ApiBody({ type: UpdateAccountLimitDto })
  @ApiResponse({
    status: 200,
    description: 'Account limit updated successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'Account not found.',
  })
  updateAccountLimit(
    @Param('account_id', ParseIntPipe) account_id: number,
    @Body() data: UpdateAccountLimitDto,
  ): Observable<UpdateAccountLimitResponse> {
    return this.accountService.updateAccountLimit({ account_id, ...data });
  }

  @Post('accounts/:account_id/products')
  @ApiOperation({ summary: 'Add product to account' })
  @ApiParam({
    name: 'account_id',
    type: Number,
    description: 'Account ID',
    example: 12345,
  })
  @ApiBody({ type: AddProductToAccountDto })
  @ApiResponse({
    status: 200,
    description: 'Product added to account successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'Account not found.',
  })
  addProductToAccount(
    @Param('account_id', ParseIntPipe) account_id: number,
    @Body() data: AddProductToAccountDto,
  ): Observable<AddProductToAccountResponse> {
    return this.accountService.addProductToAccount({ account_id, ...data });
  }

  @Delete('accounts/:account_id/products/:product')
  @ApiOperation({ summary: 'Remove product from account' })
  @ApiParam({
    name: 'account_id',
    type: Number,
    description: 'Account ID',
    example: 12345,
  })
  @ApiParam({
    name: 'product',
    type: String,
    description: 'Product to remove',
    example: 'InvestmentStock',
  })
  @ApiResponse({
    status: 200,
    description: 'Product removed from account successfully.',
  })
  @ApiResponse({
    status: 404,
    description: 'Account not found.',
  })
  removeProductFromAccount(
    @Param('account_id', ParseIntPipe) account_id: number,
    @Param('product') product: string,
  ): Observable<RemoveProductFromAccountResponse> {
    return this.accountService.removeProductFromAccount({
      account_id,
      product,
    });
  }
}
