import {
  Controller, Get, Delete, Patch, Param, Body, UseGuards
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // 👥 UTILISATEURS
  @Get('users')
  getAllUsers() {
    return this.adminService.getAllUsers();
  }

  @Patch('users/:id/role')
  changeRole(@Param('id') id: string, @Body('role') role: string) {
    return this.adminService.changeRole(id, role);
  }

  @Delete('users/:id')
  deleteUser(@Param('id') id: string) {
    return this.adminService.deleteUser(id);
  }

  // 🏗️ PROJETS
  @Get('projets')
  getAllProjets() {
    return this.adminService.getAllProjets();
  }

  @Patch('projets/:id/statut')
  updateProjetStatut(@Param('id') id: string, @Body('statut') statut: string) {
    return this.adminService.updateProjetStatut(id, statut);
  }

  @Delete('projets/:id')
  deleteProjet(@Param('id') id: string) {
    return this.adminService.deleteProjet(id);
  }

  // 💸 INVESTISSEMENTS
  @Get('investissements')
  getAllInvestissements() {
    return this.adminService.getAllInvestissements();
  }

  // 💳 TRANSACTIONS
  @Get('transactions')
  getAllTransactions() {
    return this.adminService.getAllTransactions();
  }

  // 💬 MESSAGES
  @Get('messages')
  getAllMessages() {
    return this.adminService.getAllMessages();
  }

  @Delete('messages/:id')
  deleteMessage(@Param('id') id: string) {
    return this.adminService.deleteMessage(id);
  }
  // 📊 Tableau de bord admin
@Get('dashboard')
getDashboard() {
  return this.adminService.getDashboard();
}

}
