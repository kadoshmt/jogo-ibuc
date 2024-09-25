import { describe, it, expect } from 'vitest';
import { EncryptionUtil } from './encryption.util';

describe('EncryptionUtil', () => {
  const password = 'TestPassword123!';
  let hashedPassword: string;

  it('should hash a password', async () => {
    hashedPassword = await EncryptionUtil.hashPassword(password);

    expect(hashedPassword).toBeDefined();
    expect(hashedPassword).not.toBe(password);
  });

  it('should correctly compare a password and its hash', async () => {
    hashedPassword = await EncryptionUtil.hashPassword(password);

    const isMatch = await EncryptionUtil.comparePassword(
      password,
      hashedPassword,
    );

    expect(isMatch).toBe(true);
  });

  it('should return false for incorrect password comparison', async () => {
    hashedPassword = await EncryptionUtil.hashPassword(password);

    const isMatch = await EncryptionUtil.comparePassword(
      'WrongPassword123!',
      hashedPassword,
    );

    expect(isMatch).toBe(false);
  });
});
