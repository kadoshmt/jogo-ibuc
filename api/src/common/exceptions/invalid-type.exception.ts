import { BadRequestException } from '@nestjs/common';

export class InvalidType extends BadRequestException {
  constructor() {
    super('O tipo de arquivo deve ser uma imagem do tipo jpeg, png ou webp.');
  }
}
