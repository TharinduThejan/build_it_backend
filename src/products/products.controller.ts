import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';

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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async createProduct(@Body() newproductdata: any) {
    const newProduct = await this.productsService.create(newproductdata);
    return newProduct;
  }

  @Put('/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async updateProduct(@Param('id') productId: string, @Body() updateData: any) {
    return await this.productsService.update(productId, updateData);
  }

  @Delete('/:id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  async deleteProduct(@Param('id') productId: string) {
    return await this.productsService.remove(productId);
  }
}
