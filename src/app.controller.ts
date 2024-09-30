import { Controller, Get } from '@nestjs/common';
import { Public } from './modules/auth/decorator/isPublic.decorator';

@Controller('healthcheck')
export class AppController {
  @Public()
  @Get()
  getHealth() {
    return { status: 'OK' } as const;
  }
}
