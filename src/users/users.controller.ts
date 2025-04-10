import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, UseGuards, NotFoundException, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      return await this.usersService.create(createUserDto);
    } catch {
      // Részletes hibaellenőrzés
      throw new BadRequestException('This username already exists');
    }
  }

  @Post('add-points')
  @UseGuards(AuthGuard('bearer'))
  async addPoints(@Body() body: { pointsToAdd: number }, @Req() req: any) {
    const userId = req.user.id; 
    return this.usersService.addPoints(userId, body.pointsToAdd);
  }

  @Get()
  @UseGuards(AuthGuard('bearer'))
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(+id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.usersService.findOne(+id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
