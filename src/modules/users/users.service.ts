import { MailerService } from '@nestjs-modules/mailer';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma, User } from '@prisma/client';
import * as argon2 from 'argon2';
import { randomUUID } from 'crypto';
import { PrismaService } from 'src/infra/prisma/prisma.service';

type CreateUserDto = Prisma.UserCreateInput;

@Injectable()
export class UsersService {
  constructor(
    private readonly db: PrismaService,
    private readonly mailService: MailerService,
    private configService: ConfigService,
  ) {}

  async create(
    createUserDto: CreateUserDto,
  ): Promise<CreateUserDto | undefined> {
    const existingUser = await this.db.user.findUnique({
      where: {
        email: createUserDto.email,
      },
    });

    if (existingUser) {
      throw new ConflictException('User already exists');
    }

    const hashedPassword = await argon2.hash(createUserDto.password);

    const user = await this.db.user.create({
      data: {
        ...createUserDto,
        password: hashedPassword,
      },
    });

    return {
      ...user,
      password: null,
    };
  }

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.db.user.findUnique({
      where: {
        email,
        active: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findAll() {
    return await this.db.user.findMany({});
  }

  async findOne(id: string) {
    return await this.db.user.findUnique({
      where: { id },
    });
  }

  async update(id: string, updateUserDto: Prisma.UserUpdateInput) {
    const existingUser = await this.db.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    const updatedUser = await this.db.user.update({
      where: { id },
      data: {
        ...updateUserDto,
      },
    });

    return updatedUser;
  }

  async remove(id: string) {
    const existingUser = await this.db.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new NotFoundException('User not found');
    }

    await this.db.user.delete({ where: { id } });
    return;
  }

  async resetPassword({
    token,
    password,
  }: {
    token: string;
    password: string;
  }) {
    const user = await this.db.user.findFirst({
      where: { activationCode: token },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const hashedPassword = await argon2.hash(password);

    const updatedUser = await this.db.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        activationCode: null,
      },
    });

    return updatedUser;
  }

  async sendResetPasswordEmail({ email }: { email: string }) {
    const user = await this.findByEmail(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const token = randomUUID();

    this.db.user.update({
      where: { id: user.id },
      data: {
        activationCode: token,
      },
    });

    const front_url = this.configService.get<string>('FRONT_URL');

    await this.mailService
      .sendMail({
        from: 'AfiliaBet <ruanvictormr@gmail.com>',
        to: user.email,
        subject: `How to Send Emails with Nodemailer`,
        html: `Hello ${user.name}, please click on the link to reset your password: <a href="${front_url}/reset-password/${token}">Reset Password</a>`,
      })
      .then(() => {
        console.log('email enviado');
      });
  }

  async countAll(query: string) {
    if (query === '1') {
      return await this.db.user.count({
        where: { active: true },
      });
    }

    return await this.db.user.count();
  }
}
