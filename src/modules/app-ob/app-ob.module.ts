import { Module } from '@nestjs/common';
import { AppObService } from './app-ob.service';
import { AppObController } from './app-ob.controller';

@Module({
  controllers: [AppObController],
  providers: [AppObService],
})
export class AppObModule {}
