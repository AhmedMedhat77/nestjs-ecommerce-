import { BrandRepository } from '@models/Brand/brand.repository';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';

@Injectable()
export class BrandService {
  constructor(private readonly brandRepository: BrandRepository) {}

  async create(createBrandDto: CreateBrandDto) {
    // Check if brand with same name already exists
    const existingBrand = await this.brandRepository.findOne({
      name: createBrandDto.name,
    });

    if (existingBrand) {
      throw new ConflictException('Brand with this name already exists');
    }

    return await this.brandRepository.createBrand(createBrandDto);
  }

  async findAll() {
    return await this.brandRepository.findAll({});
  }

  async findActive() {
    return await this.brandRepository.findActiveBrands();
  }

  async findOne(id: string) {
    const brand = await this.brandRepository.findOne({
      _id: new Types.ObjectId(id),
    });

    if (!brand) {
      throw new NotFoundException(`Brand with ID ${id} not found`);
    }

    return brand;
  }

  async update(id: string, updateBrandDto: UpdateBrandDto) {
    const brand = await this.brandRepository.findOne({
      _id: new Types.ObjectId(id),
    });

    if (!brand) {
      throw new NotFoundException(`Brand with ID ${id} not found`);
    }

    // If name is being updated, check for conflicts
    if (updateBrandDto.name && updateBrandDto.name !== brand.name) {
      const existingBrand = await this.brandRepository.findOne({
        name: updateBrandDto.name,
      });
      if (existingBrand) {
        throw new ConflictException('Brand with this name already exists');
      }
    }

    return await this.brandRepository.findOneAndUpdate(
      { _id: new Types.ObjectId(id) },
      { $set: updateBrandDto },
      { new: true },
    );
  }

  async remove(id: string) {
    const brand = await this.brandRepository.findOne({
      _id: new Types.ObjectId(id),
    });

    if (!brand) {
      throw new NotFoundException(`Brand with ID ${id} not found`);
    }

    return await this.brandRepository.deleteById(new Types.ObjectId(id) as any);
  }
}
