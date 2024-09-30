import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import { GetAppsDto } from './dto/get-apps.dto';

@Injectable()
export class AppsService {
  constructor(private readonly db: PrismaService) {}

  async create(data: Prisma.DadosCreateInput, userId: string) {
    const appExist = await this.db.dados.findUnique({
      where: {
        nomeApp: data.nomeApp,
      },
    });

    if (appExist) {
      throw new ConflictException('App already exists');
    }

    const app = await this.db.dados.create({
      data: {
        ...data,
        status: true,
        temVip: true,
        User: {
          connect: {
            id: userId,
          },
        },
      },
    });

    return app;
  }

  async findAll({ userId, limit = 10, page = 1 }: GetAppsDto) {
    const skip = (page - 1) * limit;
    const take = limit;

    const totalCount = await this.db.dados.count({
      where: {
        userId: {
          equals: userId,
        },
      },
    });

    const apps = await this.db.dados.findMany({
      where: {
        userId: {
          equals: userId,
        },
      },
      skip,
      take,
    });

    const totalPages = Math.ceil(totalCount / limit);

    return { page, limit, totalCount, totalPages, apps };
  }

  async findOne(id: string) {
    const app = await this.db.dados.findUnique({
      where: {
        id,
        status: true,
      },
    });

    if (!app) {
      throw new NotFoundException('App not found');
    }

    return app;
  }

  async findALlAppsWithoutUser() {
    return await this.db.dados.count();
  }

  async findAllAll() {
    return await this.db.dados.findMany();
  }

  async update(id: string, data: Prisma.DadosUpdateInput) {
    const appExist = await this.db.dados.findUnique({
      where: { id },
    });

    if (!appExist) {
      throw new NotFoundException('App not found');
    }

    return await this.db.dados.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    const appExist = await this.db.dados.findUnique({
      where: { id },
    });

    if (!appExist) {
      throw new NotFoundException('App not found');
    }

    return await this.db.dados.delete({ where: { id } });
  }
}
