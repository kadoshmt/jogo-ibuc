import { HttpException, HttpStatus } from '@nestjs/common';

export class UsernameConflictException extends HttpException {
  constructor(message = 'Username já registrado') {
    super(message, HttpStatus.CONFLICT);
  }
}
