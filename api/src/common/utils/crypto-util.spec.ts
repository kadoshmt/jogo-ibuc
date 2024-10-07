import { describe, it, expect, beforeEach, vi } from 'vitest';
import { encrypt, decrypt } from './crypto-util';

// Mocka o process.env.ENCRYPTION_KEY
vi.mock('dotenv', () => ({
  config: vi.fn(() => {
    process.env.ENCRYPTION_KEY =
      '35b725f10c9c31c70d97880dfe7491b3a9b1f5b4d2e7b5b1c5d9e7f5a8b0c7d6';
  }),
}));

describe('CryptoUtil', () => {
  const textToEncrypt = 'texto-secreto';
  let encryptedText: string;

  beforeEach(() => {
    // Reconfigura o dotenv antes de cada teste para garantir que a chave de criptografia seja correta
    vi.resetModules();
  });

  it('should encrypt text successfully', () => {
    encryptedText = encrypt(textToEncrypt);
    expect(encryptedText).toBeDefined();
    expect(encryptedText.split(':')).toHaveLength(2); // Deve ter IV e texto encriptado
  });

  it('should decrypt text back to original successfully', () => {
    encryptedText = encrypt(textToEncrypt);
    const decryptedText = decrypt(encryptedText);
    expect(decryptedText).toBe(textToEncrypt); // Verifica se o texto descriptografado é igual ao original
  });

  it('should fail decrypting when using tampered data', () => {
    encryptedText = encrypt(textToEncrypt);
    const tamperedEncryptedText = encryptedText.slice(0, -1); // Tenta modificar o texto encriptado
    expect(() => decrypt(tamperedEncryptedText)).toThrow(); // Deve lançar um erro ao tentar descriptografar
  });
});
