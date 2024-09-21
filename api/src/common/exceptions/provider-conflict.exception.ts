import { BadRequestException } from '@nestjs/common';

export class ProviderConflictException extends BadRequestException {
  constructor() {
    super(
      'This email is already registered with another authentication provider.',
    );
  }
}
