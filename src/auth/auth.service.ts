import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { PrismaService } from 'src/prisma.service';
import { verify } from 'argon2';
import { randomBytes } from 'node:crypto';

@Injectable()
export class AuthService {
  constructor(private db: PrismaService) {}

  async login(loginDto: LoginDto) {
    const user = await this.db.user.findUniqueOrThrow({
      where: {
        username: loginDto.username,
      }
    });
    if (await verify(user.password, loginDto.password)) {
      return this.db.token.create({
        data: {
          token: randomBytes(32).toString('hex'),
          user: { connect: { id: user.id } },
        }
      })
    } else {
      throw new Error('Invalid pass');
    }
  }
}
