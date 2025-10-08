import { Injectable } from '@nestjs/common';

@Injectable()
export class TestService {
  getHello() {
    return 'MongoDB connecté et NestJS fonctionne 🚀';
  }
}
