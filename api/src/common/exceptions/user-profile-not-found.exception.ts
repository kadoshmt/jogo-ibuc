import { HttpException, HttpStatus } from '@nestjs/common';

export class UserProfileNotFoundException extends HttpException {
  constructor(
    message = 'Usuário não encontrado ou senha incorreta/não definida',
  ) {
    super(message, HttpStatus.BAD_REQUEST);
  }
}
