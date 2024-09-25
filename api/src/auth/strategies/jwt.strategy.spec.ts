import { describe, it, expect, beforeEach, vi } from 'vitest';
import { JwtStrategy } from './jwt.strategy';
import { IUserRepository } from 'src/users/interfaces/user-repository.interface';
import { UnauthorizedException } from '@nestjs/common';
import { Users } from '@prisma/client';

describe('JwtStrategy', () => {
  let jwtStrategy: JwtStrategy;
  let userRepository: IUserRepository;

  // Define um segredo JWT para ser utilizado nos testes
  const JWT_SECRET_KEY = 'test-secret-key';

  beforeEach(() => {
    userRepository = {
      findOneByEmail: vi.fn(),
    } as any;

    // Define a variável de ambiente para o segredo JWT
    process.env.JWT_SECRET_KEY = JWT_SECRET_KEY;

    jwtStrategy = new JwtStrategy(userRepository);
  });

  it('should validate and return a user if valid token is provided', async () => {
    const payload = { username: 'test@example.com', role: 'ADMIN' };
    const mockUser: Users = {
      id: '1',
      email: 'test@example.com',
      password: 'hashedpassword',
      role: 'ADMIN',
      createdAt: new Date(),
      updatedAt: new Date(),
      googleId: null,
      microsoftId: null,
      facebookId: null,
      newsletter: true,
    };

    (userRepository.findOneByEmail as any).mockResolvedValue(mockUser);

    const result = await jwtStrategy.validate(payload);

    expect(result).toBeDefined();
    expect(result.email).toBe(payload.username);
    expect(result.role).toBe(payload.role);
  });

  it('should throw UnauthorizedException if user is not found', async () => {
    const payload = { username: 'notfound@example.com', role: 'ADMIN' };

    (userRepository.findOneByEmail as any).mockResolvedValue(null);

    await expect(jwtStrategy.validate(payload)).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
