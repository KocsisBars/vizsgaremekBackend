import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { hash } from 'argon2';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class UsersService {
  constructor(private db: PrismaService) {}

  /**
   * Creates a new user with the provided data.
   * @param createUserDto - Data Transfer Object containing user creation data.
   * @returns The newly created user without the password field.
   */
  async create(createUserDto: CreateUserDto) {
    const hashedPw = await hash(createUserDto.password);
    const [newUser] = await this.db.$transaction([
      this.db.user.create({
        data: {
          username: createUserDto.username,
          password: hashedPw,
        },
      }),
      this.db.points.create({
        data: {
          pointsWordle: 0,
          pointsSnake: 0,
          pointsFlappyBird: 0,
          user: {
            connect: { username: createUserDto.username },
          },
        },
      }),
    ]);

    delete newUser.password;
    return newUser;
  }

  /**
   * Retrieves all users.
   * @returns An array of all users.
   */
  findAll() {
    return this.db.user.findMany();
  }

  /**
   * Retrieves a user by their ID.
   * @param id - The ID of the user to retrieve.
   * @returns The user with the specified ID, or null if not found.
   */
  async findOne(id: number) {
    return await this.db.user.findUnique({
      where: { id }
    });
  }

  /**
   * Updates a user with the provided data.
   * @param id - The ID of the user to update.
   * @param updateUserDto - Data Transfer Object containing user update data.
   * @returns The updated user.
   */
  async update(id: number, updateUserDto: UpdateUserDto) {
    return await this.db.user.update({
      where: { id },
      data: updateUserDto
    });
  }

  /**
   * Removes a user by their ID.
   * @param id - The ID of the user to remove.
   * @returns The removed user.
   */
  remove(id: number) {
    return this.db.user.delete({
      where: { id }
    });
  }
}
