import { Injectable } from '@nestjs/common';
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
    // Find the highest productId in the collection
    const lastProduct = await this.productModel.findOne(
      {},
      {},
      { sort: { productId: -1 } },
    );
    const nextProductId = lastProduct?.productId
      ? lastProduct.productId + 1
      : 1;
    const newProduct = new this.productModel({
      ...product,
      productId: nextProductId,
    });
    return newProduct.save();
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
