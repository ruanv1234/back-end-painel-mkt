import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { Public } from '../auth/decorator/isPublic.decorator';
import { UsersService } from './users.service';

@ApiBearerAuth()
@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post()
  @HttpCode(HttpStatus.OK)
  create(@Body() createUserDto: Prisma.UserCreateInput) {
    return this.usersService.create(createUserDto);
  }

  @Public()
  @Post('reset-password-email')
  resetPassword(@Body() { email }: { email: string }) {
    return this.usersService.sendResetPasswordEmail({ email });
  }

  @Public()
  @Post('reset-password/:token')
  resetPasswordByToken(
    @Param('token') token: string,
    @Body() { password }: { password: string },
  ) {
    return this.usersService.resetPassword({ token, password });
  }

  @Get('count-all')
  countAll(@Query('active') query: string) {
    return this.usersService.countAll(query);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: Prisma.UserUpdateInput,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
