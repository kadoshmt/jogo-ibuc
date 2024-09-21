import {
  Injectable,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { LoginInputDto } from '../dto/login-input.dto';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // Transformar e validar os dados de entrada
    const loginDto = plainToInstance(LoginInputDto, request.body);
    const errors = await validate(loginDto);

    if (errors.length > 0) {
      // Extrair mensagens de erro
      const messages = errors.flatMap((error) =>
        Object.values(error.constraints || {}),
      );

      // Lançar exceção com as mensagens de erro
      throw new BadRequestException({
        message: messages,
        error: 'Bad Request',
        statusCode: 400,
      });
    }

    // Chamar o método original do guard
    return super.canActivate(context) as boolean;
  }
}
