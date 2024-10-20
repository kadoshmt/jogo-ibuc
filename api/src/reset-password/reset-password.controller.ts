import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ResetPasswordUseCase } from './usecases/reset-password.usecase';
import { RequestPasswordResetUseCase } from './usecases/request-password-reset.usecase';
import { Public } from 'src/auth/decorators/public.decorator';
import { ResetPasswordInputDTO } from './dtos/reset-password-input.dot';
import { RequestPasswordResetInputDto } from './dtos/request-password-reset-input.dto';

@Controller('reset-password')
export class ResetPasswordController {
  constructor(
    private readonly requestPasswordResetUseCase: RequestPasswordResetUseCase,
    private readonly resetPasswordUseCase: ResetPasswordUseCase,
  ) {}

  // Rota para requisitar a alteração de senha do usuário
  @Post('request')
  @Public()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async requestPassword(
    @Body() body: RequestPasswordResetInputDto,
  ): Promise<void> {
    await this.requestPasswordResetUseCase.execute(body.email);
  }

  // Rota para redefinição de senha
  @Post()
  @Public()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async resetPassword(@Body() body: ResetPasswordInputDTO) {
    await this.resetPasswordUseCase.execute(body.token, body.password);
    return { message: 'Senha redefinida com sucesso' };
  }
}
