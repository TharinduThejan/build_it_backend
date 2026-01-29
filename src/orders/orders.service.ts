import {
  Injectable,
  BadRequestException,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order, OrderDocument, OrderStatus } from './schemas/order.schema';
import { Product } from '../products/schemas/product.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name)
    private orderModel: Model<OrderDocument>,
    @InjectModel(Product.name)
    private productModel: Model<Product>,
  ) {}

  async createOrder(userId: string, dto: CreateOrderDto) {
    const items: {
      productId: Types.ObjectId;
      productName: string;
      quantity: number;
      price: number;
    }[] = [];
    let total = 0;

    for (const item of dto.items) {
      const product = await this.productModel.findOneAndUpdate(
        { _id: item.productId, qty: { $gte: item.quantity } },
        { $inc: { qty: -item.quantity } },
        { new: true },
      );

      if (!product) {
        throw new BadRequestException('Insufficient stock');
      }

      items.push({
        productId: product._id,
        productName: product.name,
        quantity: item.quantity,
        price: product.price,
      });

      total += product.price * item.quantity;
    }

    const order = await this.orderModel.create({
      userId,
      items,
      totalAmount: total,
      notes: dto.notes,
    });

    return order;
  }

  async getAllOrders() {
    return this.orderModel
      .find()
      .populate('userId', 'email role')
      .populate('items.productId', 'name price');
  }

  async getOrdersByUserId(userId: string) {
    return this.orderModel
      .find({ userId })
      .populate('items.productId', 'name price');
  }

  async getOrderById(orderId: string, user: { role: string; sub: string }) {
    const order = await this.orderModel.findById(orderId);
    if (!order) throw new NotFoundException();

    if (user.role !== 'admin' && order.userId.toString() !== user.sub) {
      throw new ForbiddenException();
    }

    return order;
  }

  async updateOrderStatus(orderId: string, dto: UpdateOrderStatusDto) {
    const order = await this.orderModel.findById(orderId);
    if (!order) throw new NotFoundException();

    order.status = dto.status;
    await order.save();
    return order;
  }

  async deleteOrder(orderId: string) {
    const order = await this.orderModel.findById(orderId);
    if (!order) throw new NotFoundException();

    if (![OrderStatus.PENDING, OrderStatus.CANCELLED].includes(order.status)) {
      throw new BadRequestException();
    }

    await order.deleteOne();
    return { message: 'Order deleted' };
  }
}
