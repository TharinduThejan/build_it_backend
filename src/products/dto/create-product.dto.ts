export class CreateProductDto {
  productId?: number;
  name!: string;
  price!: number;
  qty!: number;
  category!: string;
  image!: string;
}
