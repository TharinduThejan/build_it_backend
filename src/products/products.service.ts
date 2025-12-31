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
    this.productModel.push({ ...product,id:this.product.length+1 });
    const newProduct = new this.productModel(product);
    return newProduct.save();
  }

  async findAll() {
    return this.productModel.find().exec();
  }

  async findOne(id: string) {
    return this.productModel.findOne({ productid: Number(id) }).exec();
  }

  async update(id: string, updateData: any) {
    return this.productModel.findOneAndUpdate({ productid: Number(id) }, updateData,{ new: true }).exec();
  }

  async remove(id: string) {
    return this.productModel.findOneAndDelete({ productid: Number(id) });
  }
}

