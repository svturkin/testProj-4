import {
  Controller,
  Post,
  Body,
  UsePipes,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiBearerAuth,
  ApiTags,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Transaction } from './schemas/transactions.schema';
import { TransactionsService } from './transactions.service';
import { CreateTransactionResponseDto } from './dto/create-transaction-response.dto';
import { GetFullAmountDto } from './dto/full-amount-by-date.dto';
import { GetFullAmountResponseDto } from './dto/full-amount-by-date-response.dto';
import { UserTransactionsDto } from './dto/user-transactions.dto';

@ApiBearerAuth('JWT-auth')
@ApiTags('transactions')
@UseGuards(JwtAuthGuard)
@UsePipes(new ValidationPipe({ transform: true }))
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  @ApiCreatedResponse({
    description: 'Транзакция успешно создана',
    type: CreateTransactionResponseDto,
  })
  @ApiOperation({ summary: 'Создание транзакции' })
  @Post('create')
  create(
    @Body() createTransactionDto: CreateTransactionDto,
  ): Promise<CreateTransactionResponseDto> {
    return this.transactionsService.create(createTransactionDto);
  }

  @ApiCreatedResponse({
    description: 'Сумма транзакций за день успешно получена',
    type: GetFullAmountDto,
  })
  @ApiOperation({ summary: 'Получение суммы транзакций за день' })
  @Post('getsum')
  getFullAmountByDate(
    @Body() getFullAmountDto: GetFullAmountDto,
  ): Promise<GetFullAmountResponseDto> {
    return this.transactionsService.getFullAmountByDate(getFullAmountDto);
  }

  @ApiCreatedResponse({
    description: 'Список транзакций успешно получен',
    type: [Transaction],
  })
  @ApiOperation({ summary: 'Получение списка транзакций пользователя' })
  @Post('getlist')
  getTransactionsByUserID(
    @Body() userTransactionsDto: UserTransactionsDto,
  ): Promise<Transaction[]> {
    return this.transactionsService.getTransactionsByUserID(
      userTransactionsDto,
    );
  }
}
