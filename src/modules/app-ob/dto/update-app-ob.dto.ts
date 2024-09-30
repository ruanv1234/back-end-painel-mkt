import { PartialType } from '@nestjs/swagger';
import { CreateAppObDto } from './create-app-ob.dto';

export class UpdateAppObDto extends PartialType(CreateAppObDto) {}
