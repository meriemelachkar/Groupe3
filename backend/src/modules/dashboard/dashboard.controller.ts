import { Controller, Get, Req, UseGuards, Param } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';


@Controller('dashboard')
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) { }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Get('promoteur')
    async getDashboardPromoteur(@Req() req) {
        const promoteurId = req.user.userId;
        return this.dashboardService.getPromoteurDashboard(promoteurId);
    }

    @Get('promoteur/:bienId')
    @UseGuards(JwtAuthGuard)
    async getBienDetails(@Param('bienId') bienId: string, @Req() req) {
        const promoteurId = req.user.userId;
        return this.dashboardService.getBienDetails(bienId, promoteurId);
    }
}
