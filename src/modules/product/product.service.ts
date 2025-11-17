import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductRepository } from '@models/Product/product.repository';
import { CategoryRepository } from '@models/Category/category.repository';
import { BrandRepository } from '@models/Brand/brand.repository';
import { Types } from 'mongoose';

@Injectable()
export class ProductService {
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly categoryRepository: CategoryRepository,
    private readonly brandRepository: BrandRepository,
  ) {}

  async create(createProductDto: CreateProductDto, sellerId: string) {
    // Validate category if provided
    if (createProductDto.categoryId) {
      const category = await this.categoryRepository.findOne({
        _id: new Types.ObjectId(createProductDto.categoryId),
      });
      if (!category) {
        throw new NotFoundException('Category not found');
      }
    }

    // Validate brand if provided
    if (createProductDto.brandId) {
      const brand = await this.brandRepository.findOne({
        _id: new Types.ObjectId(createProductDto.brandId),
      });
      if (!brand) {
        throw new NotFoundException('Brand not found');
      }
    }

    const productData = {
      ...createProductDto,
      sellerId: new Types.ObjectId(sellerId) as any,
      categoryId: createProductDto.categoryId
        ? (new Types.ObjectId(createProductDto.categoryId) as any)
        : undefined,
      brandId: createProductDto.brandId
        ? (new Types.ObjectId(createProductDto.brandId) as any)
        : undefined,
    };

    return await this.productRepository.createProduct(productData);
  }

  async findAll() {
    return await this.productRepository.findActiveProducts();
  }

  async findOne(id: string) {
    const product = await this.productRepository.findOne({
      _id: new Types.ObjectId(id),
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.findOne({
      _id: new Types.ObjectId(id),
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    // Validate category if being updated
    if (updateProductDto.categoryId) {
      const category = await this.categoryRepository.findOne({
        _id: new Types.ObjectId(updateProductDto.categoryId),
      });
      if (!category) {
        throw new NotFoundException('Category not found');
      }
    }

    // Validate brand if being updated
    if (updateProductDto.brandId) {
      const brand = await this.brandRepository.findOne({
        _id: new Types.ObjectId(updateProductDto.brandId),
      });
      if (!brand) {
        throw new NotFoundException('Brand not found');
      }
    }

    const updateData: any = {
      ...updateProductDto,
      categoryId: updateProductDto.categoryId
        ? (new Types.ObjectId(updateProductDto.categoryId) as any)
        : undefined,
      brandId: updateProductDto.brandId
        ? (new Types.ObjectId(updateProductDto.brandId) as any)
        : undefined,
    };

    return await this.productRepository.findOneAndUpdate(
      { _id: new Types.ObjectId(id) },
      { $set: updateData },
      { new: true },
    );
  }

  async remove(id: string) {
    const product = await this.productRepository.findOne({
      _id: new Types.ObjectId(id),
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return await this.productRepository.deleteById(new Types.ObjectId(id) as any);
  }
}
