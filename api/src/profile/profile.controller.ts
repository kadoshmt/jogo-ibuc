import {
  Controller,
  Get,
  Put,
  Delete,
  Body,
  UsePipes,
  ValidationPipe,
  // UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
// import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { AuthenticatedRequest } from 'src/auth/interfaces/authenticated-request.interface';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get()
  async getProfile(@Request() req: AuthenticatedRequest) {
    const userId = req.user.id;
    return this.profileService.getProfile(userId);
  }

  @Put('edit')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async updateProfile(
    @Request() req: AuthenticatedRequest,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    const userId = req.user.id;
    console.log(updateProfileDto);
    return this.profileService.updateProfile(userId, updateProfileDto);
  }

  @Put('change-password')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async changePassword(
    @Request() req: AuthenticatedRequest,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    const userId = req.user.id;
    return this.profileService.changePassword(userId, changePasswordDto);
  }

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteAccount(@Request() req: AuthenticatedRequest) {
    const userId = req.user.id;
    await this.profileService.deleteAccount(userId);
  }
}
