import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoryService {

  constructor(private readonly prisma: PrismaService) { }
  async create(createCategoryDto: CreateCategoryDto) {
      try {
      let created = await this.prisma.category.create({ data: createCategoryDto })
      return ({ data: created })
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async findAll() {
    try {
      let data = await this.prisma.category.findMany({include:{Product:true}})
      return { data }
    } catch (error) {
      throw new BadRequestException(error.message)

    }

  }

  async findOne(id: number) {
    try {
      let data = await this.prisma.category.findUnique({ where: { id } })
      return { data }
    } catch (error) {
      throw new BadRequestException(error.message)

    }
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    try {
      let updated = await this.prisma.category.update({ where: { id }, data: updateCategoryDto })
      return { data: updated }
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async remove(id: number) {

    try {
      let deleted = await this.prisma.category.delete({ where: { id } })
    return {data: deleted}
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }
}
