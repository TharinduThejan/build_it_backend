import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { CreateProductDto } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private productModel: Model<ProductDocument>,
  ) {}

  async create(product: CreateProductDto) {
    try {
      // Find the highest productId in the collection
      const lastProduct = await this.productModel.findOne(
        {},
        {},
        { sort: { productId: -1 } },
      );
      const lastId = Number(lastProduct?.productId);
      const nextProductId =
        Number.isFinite(lastId) && lastId > 0 ? lastId + 1 : 1;
      const newProduct = new this.productModel({
        ...product,
        qty: product.qty ?? 0,
        productId: nextProductId,
      });
      return newProduct.save();
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Failed to create product';
      throw new BadRequestException(message);
    }
  }

  async findAll() {
    return this.productModel.find().exec();
  }

  async findOne(id: string) {
    return this.productModel.findOne({ productId: Number(id) }).exec();
  }

  async update(id: string, updateData: Partial<Product>) {
    return this.productModel
      .findOneAndUpdate({ productId: Number(id) }, updateData, { new: true })
      .exec();
  }

  async remove(id: string) {
    return this.productModel.findOneAndDelete({ productId: Number(id) });
  }
}
