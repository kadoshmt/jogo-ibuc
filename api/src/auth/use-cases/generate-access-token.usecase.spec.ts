import { describe, it, expect, beforeEach } from 'vitest';
import { GenerateAccessTokenUseCase } from './generate-access-token.usecase';
import { JwtService } from '@nestjs/jwt';
import { UserJwtPayload } from '../dtos/user-jwt-payload.dto';

describe('GenerateAccessTokenUseCase', () => {
  let generateAccessTokenUseCase: GenerateAccessTokenUseCase;
  let jwtService: JwtService;

  beforeEach(() => {
    jwtService = new JwtService({}); // Criando uma instância simples do JwtService
    generateAccessTokenUseCase = new GenerateAccessTokenUseCase(jwtService);

    // Mock do método `sign` do JwtService
    vi.spyOn(jwtService, 'sign').mockReturnValue('mockedAccessToken');
  });

  it('should generate an access token successfully', async () => {
    const userPayload: UserJwtPayload = {
      id: 'user-id-1',
      email: 'user@example.com',
      role: 'USER',
    };

    const result = await generateAccessTokenUseCase.execute(userPayload);

    expect(result).toBe('mockedAccessToken');
    expect(jwtService.sign).toHaveBeenCalledWith(
      {
        username: userPayload.email,
        sub: userPayload.id,
        role: userPayload.role,
      },
      { expiresIn: process.env.JWT_EXPIRES_IN },
    );
  });
});
