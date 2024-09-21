import { HttpException, HttpStatus } from '@nestjs/common';

export class EmailConflictException extends HttpException {
  constructor(message = 'E-mail já registrado') {
    super(message, HttpStatus.CONFLICT);
  }
}
