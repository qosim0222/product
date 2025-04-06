import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductService {
  constructor(private readonly prisma:PrismaService){}
 async create(createProductDto: CreateProductDto) {
   try {
        let created = await this.prisma.product.create({ data: createProductDto})
        return ({ data: created })
      } catch (error) {
        throw new BadRequestException(error.message)
      }
    }
  
    async findAll() {
      try {
        let data = await this.prisma.product.findMany({include:{category:true}})
        return { data }
      } catch (error) {
        throw new BadRequestException(error.message)
  
      }
  
    }
  
    async findOne(id: number) {
      try {
        let data = await this.prisma.product.findUnique({ where: { id } })
        return { data }
      } catch (error) {
        throw new BadRequestException(error.message)
  
      }
    }
  
    async update(id: number, updateproductDto: UpdateProductDto) {
      try {
        let updated = await this.prisma.product.update({ where: { id }, data: updateproductDto })
        return { data: updated }
      } catch (error) {
        throw new BadRequestException(error.message)
      }
    }
  
    async remove(id: number) {
  
      try {
        let deleted = await this.prisma.product.delete({ where: { id } })
      return {data: deleted}
      } catch (error) {
        throw new BadRequestException(error.message)
      }
    }
  }