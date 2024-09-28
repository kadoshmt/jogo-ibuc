import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
  UsePipes,
  ValidationPipe,
  Inject,
  Res,
  Param,
  NotFoundException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RegisterInputDto } from './dtos/register-input.dto';
import { Public } from './decorators/public.decorator';
import { Throttle } from '@nestjs/throttler';
import { IAuthenticatedRequest } from './interfaces/authenticated-request.interface';
import { RegisterUseCase } from './use-cases/register.usecase';
import { GenerateAccessTokenUseCase } from './use-cases/generate-access-token.usecase';
import { ValidateUserUseCase } from './use-cases/validade-user.usecase';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { v4 as uuidv4 } from 'uuid';
import { CACHE_MANAGER, CacheStore } from '@nestjs/cache-manager';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly registerUseCase: RegisterUseCase,
    private readonly generateAccessTokenUseCase: GenerateAccessTokenUseCase,
    private readonly validateUserUseCase: ValidateUserUseCase,
    @Inject(CACHE_MANAGER) private cacheManager: CacheStore,
  ) {}

  // Rota para registro de novos usuários
  @Public()
  @Post('register')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async register(@Body() body: RegisterInputDto) {
    const user = await this.registerUseCase.execute(body);
    const accessToken = await this.generateAccessTokenUseCase.execute({
      email: user.email,
      id: user.id,
      role: user.role,
    });
    return { accessToken, user };
  }

  // Rota para login por e-mail/senha
  @Public()
  @Post('login')
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @UseGuards(LocalAuthGuard)
  async login(@Request() req: IAuthenticatedRequest): Promise<any> {
    const user = await this.validateUserUseCase.execute(req.user);
    const accessToken = await this.generateAccessTokenUseCase.execute({
      email: user.email,
      id: user.id,
      role: user.role,
    });

    return { accessToken, user };
  }

  // Rota para redirecionar o usuário para o Google
  @Public()
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {
    // Inicia o fluxo de autenticação
  }

  // Rota de callback após autenticação no Google
  @Public()
  @Get('google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(
    @Request() req: IAuthenticatedRequest,
    @Res() res: Response,
  ): Promise<void> {
    const user = await this.validateUserUseCase.execute(req.user);
    const accessToken = await this.generateAccessTokenUseCase.execute({
      email: user.email,
      id: user.id,
      role: user.role,
    });

    // Gerar um código único temporário (pode ser um UUID)
    const uuid = uuidv4();

    // Armazenar o código e o usuário em algum armazenamento temporário (por exemplo, Redis ou memória)
    await this.cacheManager.set(uuid, { accessToken, user }, { ttl: 60 * 2 }); // TTL em segundos (2 minutos)

    // Redirecionar para o front-end com o código
    res.redirect(`http://localhost:3000/auth/callback/${uuid}`);
  }

  // Rota para redirecionar o usuário para a Microsoft
  @Public()
  @Get('microsoft')
  @UseGuards(AuthGuard('microsoft'))
  async microsoftAuth() {}

  // Rota de callback após autenticação na Microsoft
  @Public()
  @Get('microsoft/redirect')
  @UseGuards(AuthGuard('microsoft'))
  async microsoftAuthRedirect(
    @Request() req: IAuthenticatedRequest,
  ): Promise<any> {
    const user = await this.validateUserUseCase.execute(req.user);
    const accessToken = await this.generateAccessTokenUseCase.execute({
      email: user.email,
      id: user.id,
      role: user.role,
    });

    return { accessToken, user };
  }

  // Rota para redirecionar o usuário para o Facebook
  @Public()
  @Get('facebook')
  @UseGuards(AuthGuard('facebook'))
  async facebookAuth() {}

  // Rota de callback após autenticação no Facebook
  @Public()
  @Get('facebook/redirect')
  @UseGuards(AuthGuard('facebook'))
  async facebookAuthRedirect(
    @Request() req: IAuthenticatedRequest,
  ): Promise<any> {
    const user = await this.validateUserUseCase.execute(req.user);
    const accessToken = await this.generateAccessTokenUseCase.execute({
      email: user.email,
      id: user.id,
      role: user.role,
    });

    return { accessToken, user };
  }

  // Rota para trocar o token UUID pelos dados de autenticação do usuário
  @Public()
  @Get('exchange-code/:code')
  @Throttle({ default: { limit: 3, ttl: 60000 } })
  async exchangeCode(@Param('code') code: string): Promise<any> {
    const cahedData = await this.cacheManager.get(code);

    if (!cahedData) {
      throw new NotFoundException('Code not found');
    }

    return cahedData;
  }
}
