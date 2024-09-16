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
import { UsersService } from 'src/users/users.service';
import { AuthService } from './auth.service';
import { Request as ExpressRequest } from 'express';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { Role } from 'src/users/user.interface';
import { Public } from './public.decorator';

interface AuthenticatedRequest extends ExpressRequest {
  user: any; // Você pode especificar um tipo mais específico se tiver uma interface User definida
}

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  // Rota para registro de novos usuários
  @Public()
  @Post('register')
  @UsePipes(new ValidationPipe())
  async register(@Body() body: RegisterDto) {
    const { email, password, firstName, lastName } = body;

    // Verifica se o usuário já existe
    const existingUser = await this.usersService.findOneByEmail(email);
    if (existingUser) {
      return { message: 'E-mail já registrado' };
    }

    // Criptografa a senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // Cria o novo usuário
    const user = await this.usersService.createUser({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role: Role.PLAYER,
    });

    // Renomear a variável password ao desestruturar
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password: _, googleId, ...registeredUser } = user;

    return { message: 'Usuário registrado com sucesso', registeredUser };
  }

  // Rota para login por e-mail/senha
  @Public()
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req: AuthenticatedRequest) {
    return this.authService.login(req.user);
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
  @Post('refresh')
  async refresh(@Body() body: any) {
    const { refreshToken } = body;
    const user = await this.usersService.getUserIfRefreshTokenMatches(
      refreshToken,
      body.userId,
    );
    const tokens = await this.authService.login(user);
    return tokens;
  }

  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  async logout(@Request() req: AuthenticatedRequest) {
    await this.authService.logout(req.user.id);
    return { message: 'Logout realizado com sucesso' };
  }
}
