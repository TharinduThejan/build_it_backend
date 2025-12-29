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
  ) { }

  async create(data: CreateProductDto) {
    const product = new this.productModel(data);
    return product.save();
  }

  async findAll() {
    return this.productModel.find().exec();
  }

  async findOne(id: string) {
    return this.productModel.findOne({ id: +id }).exec();
  }

  async update(id: string, updateData: any) {
    // TODO: Replace 'any' with a proper DTO or type for updateData
    return this.productModel.findOneAndUpdate({ id: +id }, updateData, { new: true });
  }

  async remove(id: string) {
    return this.productModel.findOneAndDelete({ id: +id });
  }
}


