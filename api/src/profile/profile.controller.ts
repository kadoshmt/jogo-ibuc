import {
  Controller,
  Get,
  Put,
  Delete,
  Body,
  UseGuards,
  Request,
  HttpCode,
  Param,
  UsePipes,
  ValidationPipe,
  Patch,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { IAuthenticatedRequest } from 'src/auth/interfaces/authenticated-request.interface';
import { ChangePasswordInputDto } from './dtos/change-password-input.dto';
import { UpdateProfileInputDto } from './dtos/update-profile-input.dto';
import { ChangePasswordUseCase } from './use-cases/change-password.usecase';

import { GetProfileUseCase } from './use-cases/get-profile.usecase';
import { UpdateProfileUseCase } from './use-cases/update-profile.usecase';
import { ProfileOutputDto } from './dtos/profile-output.dto';
import { DeleteAccountUseCase } from './use-cases/delete-account.usecase';
import { Public } from 'src/auth/decorators/public.decorator';
import { CheckUsernameIsAvailableUseCase } from './use-cases/check-username-is-available.usecase';
import { CheckUsernameOutputDto } from './dtos/check-username-output.dto';
import { CheckPasswordWasProvidedUseCase } from './use-cases/check-password-was-provided.usecase';
import { CheckPasswordOutputDto } from './dtos/check-password-output.dto';
import { CreatePasswordInputDto } from './dtos/create-password-input.dto';
import { CreatePasswordUseCase } from './use-cases/create-password.usecase';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadAndCreateAvatarUseCase } from './use-cases/upload-and-create-avatar.usecase';
import { DeleteAvatarUseCase } from './use-cases/delete-avatar.usecase';

@Controller('profile')
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(
    private readonly getProfileUseCase: GetProfileUseCase,
    private readonly updateProfileUseCase: UpdateProfileUseCase,
    private readonly changePasswordUseCase: ChangePasswordUseCase,
    private readonly deleteAccountUseCase: DeleteAccountUseCase,
    private readonly checkUsernameIsAvaliableUseCase: CheckUsernameIsAvailableUseCase,
    private readonly checkPasswordWasProvidedUseCase: CheckPasswordWasProvidedUseCase,
    private readonly createPasswordUseCase: CreatePasswordUseCase,
    private readonly uploadAndCreateAvatarUseCase: UploadAndCreateAvatarUseCase,
    private readonly deleteAvatarUseCase: DeleteAvatarUseCase,
  ) {}

  // Rota para verificar a disponibilidade do username
  @Get('check-username/:username')
  @Public()
  async checkUsername(
    @Param('username') username: string,
  ): Promise<CheckUsernameOutputDto> {
    const isAvailable =
      await this.checkUsernameIsAvaliableUseCase.execute(username);

    return {
      isAvaliable: isAvailable,
      message: isAvailable
        ? 'Username está disponível'
        : 'Username não está disponível',
    };
  }

  // Rota para verificar se o usuário tem uma senha
  @Get('check-password')
  async checkPassword(
    @Request() req: IAuthenticatedRequest,
  ): Promise<CheckPasswordOutputDto> {
    const wasProvided = await this.checkPasswordWasProvidedUseCase.execute(
      req.user.id,
    );

    return {
      wasProvided,
      message: wasProvided
        ? 'Usuário possui password'
        : 'Usuário ainda não possui password',
    };
  }

  @Patch('create-password')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async createPassword(
    @Body() body: CreatePasswordInputDto,
    @Request() req: IAuthenticatedRequest,
  ): Promise<{ message: string }> {
    await this.createPasswordUseCase.execute(req.user.id, body.password);
    return { message: 'Senha criada com sucesso' };
  }

  // Rota para buscar os dados do perfil
  @Get()
  async getProfile(
    @Request() req: IAuthenticatedRequest,
  ): Promise<ProfileOutputDto> {
    const userId = req.user.id;
    return await this.getProfileUseCase.execute(userId);
  }

  // Rota para alteração dos dados do perfil
  @Put()
  async updateProfile(
    @Request() req: IAuthenticatedRequest,
    @Body() updateProfileDto: UpdateProfileInputDto,
  ): Promise<ProfileOutputDto> {
    const userId = req.user.id;
    return await this.updateProfileUseCase.execute(userId, updateProfileDto);
  }

  // Rota para alteração do password
  @Put('change-password')
  @HttpCode(204)
  async changePassword(
    @Request() req: IAuthenticatedRequest,
    @Body() changePasswordDto: ChangePasswordInputDto,
  ) {
    await this.changePasswordUseCase.execute(req.user.id, changePasswordDto);
  }

  // Rota que permite ao usuário apagar sua própria conta (use Case do módulo Users)
  @Delete()
  @HttpCode(204)
  async deleteAccount(@Request() req: IAuthenticatedRequest) {
    const userId = req.user.id;
    await this.deleteAccountUseCase.execute(userId);
  }

  @Patch('upload-avatar')
  @UseInterceptors(FileInterceptor('profileAvatar'))
  async uploadAvatar(
    @Request() req: IAuthenticatedRequest,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({
            maxSize: 1024 * 1024 * 5, // 5mb
          }),
          new FileTypeValidator({
            fileType: '.(png|jpg|jpeg|webp)',
          }),
        ],
      }),
    )
    profileAvatar: Express.Multer.File,
  ) {
    const result = await this.uploadAndCreateAvatarUseCase.execute({
      userId: req.user.id,
      fileName: profileAvatar.originalname,
      fileType: profileAvatar.mimetype,
      body: profileAvatar.buffer,
    });

    const { avatarUrl } = result;

    return {
      avatarUrl,
    };
  }

  // Rota que permite ao usuário apagar seu avatar
  @Delete('delete-avatar')
  @HttpCode(204)
  async deleteAvatar(@Request() req: IAuthenticatedRequest) {
    const userId = req.user.id;
    await this.deleteAvatarUseCase.execute(userId);
  }
}
