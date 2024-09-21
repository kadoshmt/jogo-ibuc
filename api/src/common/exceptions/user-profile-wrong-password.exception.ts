import { HttpException, HttpStatus } from '@nestjs/common';

export class UserProfileWrongPasswordException extends HttpException {
  constructor(message = 'A senha atual fornecida está incorreta') {
    super(message, HttpStatus.BAD_REQUEST);
  }
}
