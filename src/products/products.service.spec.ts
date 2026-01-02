import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import e from 'express';

@Injectable()
export class ProductsService {
  private products: CreateProductDto[] = [];

  getAllProducts(): CreateProductDto[] {
    return this.products;
  }

  getById(id: number) {
    let product: null | CreateProductDto = null;
    for (const productElement of this.products) {
      if (productElement.productId === id) {
        product = productElement;
        break;
      }
    }
    if (product) return product;
    else throw new NotFoundException('Product not found');
  }
  createProduct(product: CreateProductDto) {
    this.products.push({ ...product, productId: this.products.length + 1 });
    return this.products.length;
  }
  updateProduct(id: number, updateProduct: Partial<CreateProductDto>) {
    const productIndex = this.products.findIndex(product => product.productId === id);
    if (productIndex >= 0) {
      this.products.splice(productIndex, 1, { ...this.products[productIndex], ...updateProduct});
      return `product with id ${id} has been updated`;
    }
    else {
      throw new NotFoundException('Product not found');
    }
  }
  deleteProduct(id: number) {
    const productIndex = this.products.findIndex(product => product.productId === id);
    if (productIndex >= 0) {
      this.products.splice(productIndex, 1);
      return `product with id ${id} has been deleted`;
    }
    else {
      throw new NotFoundException('Product not found');
    }
}