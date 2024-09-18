/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { Public } from './decorators/public.decorator';
import { Throttle } from '@nestjs/throttler';
import { AuthenticatedRequest } from './interfaces/authenticated-request.interface';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // Rota para registro de novos usuários
  @Public()
  @Post('register')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async register(@Body() body: RegisterDto) {
    const user = await this.authService.register(body);

    return { message: 'Usuário registrado com sucesso', user };
  }

  // Rota para login por e-mail/senha
  @Public()
  @UseGuards(AuthGuard('local'))
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('login')
  async login(@Request() req: AuthenticatedRequest) {
    return await this.authService.login(req.user);
  }

  // Rota para redirecionar o usuário para o Google
  @Public()
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth(@Request() req: AuthenticatedRequest) {
    // Inicia o fluxo de autenticação
    console.log(req);
  }

  // Rota de callback após autenticação no Google
  @Public()
  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Request() req: AuthenticatedRequest) {
    // Aqui, vamos gerar o JWT e retorná-lo
    const user = req.user;
    const jwt = await this.authService.login(user);
    return {
      message: 'Autenticação via Google bem-sucedida',
      user,
      ...jwt,
    };
  }

  // Rota para redirecionar o usuário para a Microsoft
  @Public()
  @Get('microsoft')
  @UseGuards(AuthGuard('microsoft'))
  async microsoftAuth(@Request() req: AuthenticatedRequest) {
    // Inicia o fluxo de autenticação
    console.log(req);
  }

  // Rota de callback após autenticação na Microsoft
  @Public()
  @Get('microsoft/redirect')
  @UseGuards(AuthGuard('microsoft'))
  async microsoftAuthRedirect(@Request() req: AuthenticatedRequest) {
    const user = req.user;
    const jwt = await this.authService.login(user);
    return {
      message: 'Autenticação via Microsoft bem-sucedida',
      user,
      ...jwt,
    };
  }

  @Public()
  @Get('facebook')
  @UseGuards(AuthGuard('facebook'))
  async facebookAuth(@Request() req: AuthenticatedRequest) {
    // Inicia o fluxo de autenticação
  }

  @Public()
  @Get('facebook/redirect')
  @UseGuards(AuthGuard('facebook'))
  async facebookAuthRedirect(@Request() req: AuthenticatedRequest) {
    const user = req.user;
    const jwt = await this.authService.login(user);
    return {
      message: 'Autenticação via Facebook bem-sucedida',
      user,
      ...jwt,
    };
  }

  // O logout pode permanecer para remover o token do lado do cliente
  @Post('logout')
  async logout() {
    // Sem refresh tokens, não há necessidade de manipular o logout no servidor
    return { message: 'Logout realizado com sucesso' };
  }
}
