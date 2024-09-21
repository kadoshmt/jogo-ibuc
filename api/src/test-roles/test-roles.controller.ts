import { Controller, Get, Request } from '@nestjs/common';
import { Request as ExpressRequest } from 'express';
import { Public } from 'src/auth/decorators/public.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';

interface AuthenticatedRequest extends ExpressRequest {
  user: any;
}

@Controller('test-roles')
export class TestRolesController {
  @Get('protected')
  getProtectedData(@Request() req: AuthenticatedRequest) {
    return {
      message: 'Este é um endpoint protegido',
      user: req.user, // O usuário autenticado está disponível aqui
    };
  }

  @Get('home')
  @Public()
  home() {
    return { message: 'Splash Screen' };
  }

  @Roles('JOGADOR')
  @Get('play')
  getQuizForPlayer(@Request() req: AuthenticatedRequest) {
    return {
      message: 'Iniciando o quiz para o jogador ' + req.user.email,
      user: req.user,
    };
  }

  // A ordem dos decorators é importante.
  // Devemos garantir que o AuthGuard seja executado antes do RolesGuard,
  // para que o usuário seja autenticado antes de verificar o papel.
  //@UseGuards(AuthGuard('jwt'), RolesGuard) // Se AutoGuard e RolesGuard não estiver configurado globalmente
  @Roles('ADMIN', 'COLABORADOR')
  @Get('reports')
  getReports(@Request() req: AuthenticatedRequest) {
    return {
      message: 'Relatórios de acesso para ' + req.user.email,
    };
  }
}
