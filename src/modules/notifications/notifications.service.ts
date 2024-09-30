import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/infra/prisma/prisma.service';

@Injectable()
export class NotificationsService {
  constructor(private readonly db: PrismaService) {}

  async create(
    createNotificationDto: Prisma.NotificationsCreateInput,
    userID: string,
  ): Promise<any> {
    const notification = await this.db.notifications.create({
      data: {
        title: createNotificationDto.title,
        text: createNotificationDto.text,
        vista: createNotificationDto.vista,
        geral: createNotificationDto.geral,
        userId: userID,
      },
    });

    return notification;
  }

  async findAll(): Promise<any> {
    return await this.db.notifications.findMany({
      where: {},
      select: {
        id: true,
        title: true,
        text: true,
        createdAt: true,
        geral: true,
        User: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
