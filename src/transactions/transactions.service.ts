import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Transaction,
  TransactionDocument,
} from './schemas/transactions.schema';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { CreateTransactionResponseDto } from './dto/create-transaction-response.dto';
import { UsersService } from '../users/users.service';
import fetch from 'node-fetch';
import { GetFullAmountDto } from './dto/full-amount-by-date.dto';
import { GetFullAmountResponseDto } from './dto/full-amount-by-date-response.dto';
import { UserTransactionsDto } from './dto/user-transactions.dto';

@Injectable()
export class TransactionsService {
  constructor(
    @InjectModel(Transaction.name)
    private transactionModel: Model<TransactionDocument>,
    private usersService: UsersService,
  ) {}

  async create(
    createTransactionDto: CreateTransactionDto,
  ): Promise<CreateTransactionResponseDto> {
    const transactionCreator = await this.usersService.findById(
      createTransactionDto.user_id,
    );

    if (transactionCreator.currency !== 'RUB') {
      const date = createTransactionDto.date
        .toString()
        .slice(0, 10)
        .replace(/-/g, '/');

      const response = await fetch(
        `https://www.cbr-xml-daily.ru/archive/${date}/daily_json.js`,
      );
      let data = await response.json();
      data = data.Valute[transactionCreator.currency];

      createTransactionDto.amount =
        createTransactionDto.amount / data.Value / data.Nominal;
    }

    const createdTransaction = await this.transactionModel.create(
      createTransactionDto,
    );

    return {
      code: 201,
      transactionID: createdTransaction._id.toString(),
    };
  }

  async getFullAmountByDate(
    getFullAmountDto: GetFullAmountDto,
  ): Promise<GetFullAmountResponseDto> {
    let resultAmount = 0;

    let listOfTransactions = await this.transactionModel.find();
    listOfTransactions = listOfTransactions.filter((el) =>
      JSON.stringify(el.date).includes(getFullAmountDto.date),
    );

    listOfTransactions.forEach((el) =>
      el.type === 'income'
        ? (resultAmount += el.amount)
        : (resultAmount -= el.amount),
    );

    return {
      date: getFullAmountDto.date,
      sum: resultAmount,
    };
  }

  async getTransactionsByUserID(
    userTransactionsDto: UserTransactionsDto,
  ): Promise<Transaction[]> {
    const listOfUserTransactions = await this.transactionModel.find({
      user_id: userTransactionsDto.userID,
    });

    if (!listOfUserTransactions.length) throw new NotFoundException();

    const sortedList = listOfUserTransactions.sort((a, b) => {
      return a.date.getTime() - b.date.getTime();
    });

    return userTransactionsDto.sort === 'asc'
      ? sortedList.slice(
          (userTransactionsDto.page - 1) * 10,
          userTransactionsDto.page * 10,
        )
      : sortedList
          .reverse()
          .slice(
            (userTransactionsDto.page - 1) * 10,
            userTransactionsDto.page * 10,
          );
  }
}
