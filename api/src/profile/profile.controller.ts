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
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AuthenticatedRequest } from 'src/auth/interfaces/authenticated-request.interface';
import { ChangePasswordInputDto } from './dto/change-password-input.dto';
import { UpdateProfileInputDto } from './dto/update-profile-input.dto';
import { ChangePasswordUseCase } from './use-cases/change-password.usecase';

import { GetProfileUseCase } from './use-cases/get-profile.usecase';
import { UpdateProfileUseCase } from './use-cases/update-profile.usecase';
import { ProfileOutputDto } from './dto/profile-output.dto';
import { DeleteAccountUseCase } from './use-cases/delete-account.usecase';
import { Public } from 'src/auth/decorators/public.decorator';
import { CheckUsernameIsAvailableUseCase } from './use-cases/check-username-is-available.usecase';
import { CheckUsernameOutputDto } from './dto/check-username-output.dto';

@Controller('profile')
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(
    private readonly getProfileUseCase: GetProfileUseCase,
    private readonly updateProfileUseCase: UpdateProfileUseCase,
    private readonly changePasswordUseCase: ChangePasswordUseCase,
    private readonly deleteAccountUseCase: DeleteAccountUseCase,
    private readonly checkUsernameIsAvaliableUseCase: CheckUsernameIsAvailableUseCase,
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
        ? 'Username is available'
        : 'Username is already taken',
    };
  }

  // Rota para buscar os dados do perfil
  @Get()
  async getProfile(
    @Request() req: AuthenticatedRequest,
  ): Promise<ProfileOutputDto> {
    const userId = req.user.id;
    return await this.getProfileUseCase.execute(userId);
  }

  // Rota para alteração dos dados do perfil
  @Put('edit')
  async updateProfile(
    @Request() req: AuthenticatedRequest,
    @Body() updateProfileDto: UpdateProfileInputDto,
  ): Promise<ProfileOutputDto> {
    const userId = req.user.id;
    return await this.updateProfileUseCase.execute(userId, updateProfileDto);
  }

  // Rota para alteração do password
  @Put('change-password')
  @HttpCode(204)
  async changePassword(
    @Request() req: AuthenticatedRequest,
    @Body() changePasswordDto: ChangePasswordInputDto,
  ) {
    await this.changePasswordUseCase.execute(req.user.id, changePasswordDto);
  }

  // Rota que permite ao usuário apagar sua própria conta (use Case do módulo Users)
  @Delete()
  @HttpCode(204)
  async deleteAccount(@Request() req: AuthenticatedRequest) {
    const userId = req.user.id;
    await this.deleteAccountUseCase.execute(userId);
  }
}
