import { Controller, Post, Get, Patch, Param, Body, UseGuards, Request } from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('transactions')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  // 💳 Acheter un bien (acheteur)
  @Post()
  @Roles('acheteur')
  async create(@Body() dto: CreateTransactionDto, @Request() req) {
    return this.transactionsService.create(dto, req.user.userId);
  }

  // 📄 Voir mes transactions
  @Get('me')
  @Roles('acheteur')
  async findMyTransactions(@Request() req) {
    return this.transactionsService.findByAcheteur(req.user.userId);
  }

  // 🧾 Voir toutes les transactions (admin)
  @Get()
  @Roles('admin')
  async findAll() {
    return this.transactionsService.findAll();
  }

  // ✅ Confirmer une transaction (admin)
  @Patch(':id/confirmer')
  @Roles('admin')
  async confirmer(@Param('id') id: string) {
    return this.transactionsService.confirmer(id);
  }
}
