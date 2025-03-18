import { Injectable } from '@nestjs/common';
import { CreatePointDto } from './dto/create-point.dto';
import { UpdatePointDto } from './dto/update-point.dto';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class PointsService {
  constructor(private db: PrismaService) {} 
  
  async create(createPointDto: CreatePointDto) {
    return await this.db.points.create({
      data: createPointDto
    });
  }

  findAll() {
    return this.db.points.findMany();
  }

  async findOne(id: number) {
    return await this.db.points.findUnique({
      where: { id }
    });
  }

  async update(id: number, updatePointDto: UpdatePointDto) {
    return await this.db.points.update({
      where: { id },
      data: updatePointDto
    });
  }

  remove(id: number) {
    return this.db.points.delete({
      where: { id }
    });
  }
}
