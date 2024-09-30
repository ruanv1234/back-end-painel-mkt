import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Request,
} from '@nestjs/common';
import { AppsService } from './apps.service';
import { UpdateAppDto } from './dto/update-app.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/decorator/isPublic.decorator';
import { Prisma } from '@prisma/client';

@ApiBearerAuth()
@ApiTags('apps')
@Controller('apps')
export class AppsController {
  constructor(private readonly appsService: AppsService) {}

  @Post()
  create(@Request() req: any, @Body() createAppDto: Prisma.DadosCreateInput) {
    return this.appsService.create(createAppDto, req.user.id);
  }

  @Get()
  findAll(@Request() req: any) {
    const userId = req.user.id;
    return this.appsService.findAll({ userId });
  }

  @Get('all')
  findAllAll() {
    return this.appsService.findAllAll();
  }

  @Get('count-all')
  countAllApps() {
    return this.appsService.findALlAppsWithoutUser();
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.appsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAppDto: UpdateAppDto) {
    return this.appsService.update(id, updateAppDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.appsService.remove(id);
  }
}
