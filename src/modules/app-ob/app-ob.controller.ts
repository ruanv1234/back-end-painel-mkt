import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AppObService } from './app-ob.service';
import { CreateAppObDto } from './dto/create-app-ob.dto';
import { UpdateAppObDto } from './dto/update-app-ob.dto';

@Controller('apps2')
export class AppObController {
  constructor(private readonly appObService: AppObService) {}

  @Post()
  create(@Body() createAppObDto: CreateAppObDto) {
    return this.appObService.create(createAppObDto);
  }

  @Get()
  findAll() {
    return this.appObService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.appObService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAppObDto: UpdateAppObDto) {
    return this.appObService.update(+id, updateAppObDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.appObService.remove(+id);
  }
}
