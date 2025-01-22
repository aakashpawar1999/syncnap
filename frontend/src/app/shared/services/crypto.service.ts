import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import forge from 'node-forge';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CryptoService {
  private apiUrl: string = environment.apiUrl;
  private publicKeyPem: string | null = null;

  constructor(private http: HttpClient) {
    this.fetchPublicKeyFromBackend().then((res) => {
      this.publicKeyPem = res.data.replace(/\\n/g, '\n');
    });
  }

  private resolveApiUrl(version: string, path: string): string {
    return this.apiUrl + '/api/' + version + '/' + path;
  }

  async fetchPublicKeyFromBackend(): Promise<any> {
    return firstValueFrom(
      this.http.get<any>(this.resolveApiUrl('v1', 'user/public-key')),
    );
  }

  async encryptData(data: string): Promise<string> {
    if (!this.publicKeyPem) {
      throw new Error('Public key not found');
    }

    const publicKeyPem = this.publicKeyPem;
    const publicKey = forge.pki.publicKeyFromPem(publicKeyPem);
    const encrypted = publicKey.encrypt(data, 'RSA-OAEP', {
      md: forge.md.sha256.create(),
    });
    return forge.util.encode64(encrypted);
  }
}
