import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { User, UserSchema } from '../users/schemas/user.schema';
import { Projet, ProjetSchema } from '../projets/schemas/projet.schema';
import { Investissement, InvestissementSchema } from '../investissements/schemas/investissement.schema';
import { Transaction, TransactionSchema } from '../transactions/schemas/transaction.schema';
import { Message, MessageSchema } from '../messages/schemas/message.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Projet.name, schema: ProjetSchema },
      { name: Investissement.name, schema: InvestissementSchema },
      { name: Transaction.name, schema: TransactionSchema },
      { name: Message.name, schema: MessageSchema },
    ]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
