import { Controller, Get, Post, Body, Patch, Param, Delete, BadRequestException, UseGuards, NotFoundException, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthGuard } from '@nestjs/passport';
import { ApiBadRequestResponse, ApiBearerAuth, ApiBody, ApiNotFoundResponse, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    schema: {
      example: {
        id: 1,
        username: 'Proba1',
        role: 'USER',
        points: 0,
      },
    },
  })
  @ApiBadRequestResponse({ description: 'This username already exists' })
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
  @ApiBearerAuth()
  @ApiOperation({ summary: "Add points to the authenticated user's account" })
  @ApiBody({
    schema: {
      example: {
        pointsToAdd: 20,
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: 'Points successfully added',
    schema: {
      example: {
        id: 1,
        username: 'Proba1',
        points: 100,
        role: 'USER',
      },
    },
  })
  async addPoints(@Body() body: { pointsToAdd: number }, @Req() req: any) {
    const userId = req.user.id; 
    return this.usersService.addPoints(userId, body.pointsToAdd);
  }

  @Get()
  @UseGuards(AuthGuard('bearer'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'List of all users',
    schema: {
      example: [
        {
          id: 1,
          username: 'Proba1',
          points: 30,
          role: 'USER',
        },
      ],
    },
  })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiResponse({
    status: 200,
    description: 'User found',
    schema: {
      example: {
        id: 1,
        username: 'Proba1',
        points: 30,
        role: 'USER',
      },
    },
  })
  @ApiNotFoundResponse({ description: 'User with id not found' })
  async findOne(@Param('id') id: string) {
    const user = await this.usersService.findOne(+id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return user;
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a user by ID' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiNotFoundResponse({ description: 'User with id not found' })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.usersService.findOne(+id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a user by ID' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
