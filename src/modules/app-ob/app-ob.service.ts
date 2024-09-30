import { Injectable } from '@nestjs/common';
import { CreateAppObDto } from './dto/create-app-ob.dto';
import { UpdateAppObDto } from './dto/update-app-ob.dto';

@Injectable()
export class AppObService {
  create(createAppObDto: CreateAppObDto) {
    return 'This action adds a new appOb';
  }

  findAll() {
    return `This action returns all appOb`;
  }

  findOne(id: number) {
    return `This action returns a #${id} appOb`;
  }

  update(id: number, updateAppObDto: UpdateAppObDto) {
    return `This action updates a #${id} appOb`;
  }

  remove(id: number) {
    return `This action removes a #${id} appOb`;
  }
}
