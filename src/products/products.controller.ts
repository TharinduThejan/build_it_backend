import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
} from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  async allProducts() {
    return await this.productsService.findAll();
  }
  @Get('/:id')
  async getProductById(@Param('id') productId: string) {
    return await this.productsService.findOne(productId);
  }
  @Post()
  async createProduct(@Body() newproductdata: any) {
    const newProduct = await this.productsService.create(newproductdata);
    return newProduct;
  }
  @Put('/:id')
  async updateProduct(@Param('id') productId: string, @Body() updateData: any) {
    return await this.productsService.update(productId, updateData);
  }
  @Delete('/:id')
  async deleteProduct(@Param('id') productId: string) {
    return await this.productsService.remove(productId);
  }
}