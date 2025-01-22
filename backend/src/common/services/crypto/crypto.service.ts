import { Injectable } from '@nestjs/common';
import * as forge from 'node-forge';

@Injectable()
export class CryptoService {
  private publicKey: string;
  private privateKey: string;

  constructor() {
    this.publicKey = process.env.PUBLIC_KEY as string;
    this.privateKey = process.env.PRIVATE_KEY as string;

    if (!this.publicKey || !this.privateKey) {
      throw new Error(
        'Public and private keys must be set in environment variables.',
      );
    }
  }

  /**
   * Encrypts data using the public key
   * @param data - Data to encrypt
   * @returns Base64 encrypted string
   */
  encrypt(data: string): string {
    const publicKey = forge.pki.publicKeyFromPem(this.publicKey);
    const encrypted = publicKey.encrypt(data, 'RSA-OAEP', {
      md: forge.md.sha256.create(),
    });
    return forge.util.encode64(encrypted);
  }

  /**
   * Decrypts encrypted data using the private key
   * @param encryptedData - Encrypted string (Base64)
   * @returns Decrypted string
   */
  decrypt(encryptedData: string): string {
    const privateKey = forge.pki.privateKeyFromPem(this.privateKey);
    const encryptedBytes = forge.util.decode64(encryptedData);
    const decrypted = privateKey.decrypt(encryptedBytes, 'RSA-OAEP', {
      md: forge.md.sha256.create(),
    });
    return decrypted;
  }
}
