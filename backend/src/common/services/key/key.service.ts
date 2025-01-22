import { Injectable } from '@nestjs/common';

@Injectable()
export class KeyService {
  constructor() {}

  get publicKey(): string {
    return process.env.PUBLIC_KEY;
  }

  get privateKey(): string {
    return process.env.PRIVATE_KEY;
  }
}
