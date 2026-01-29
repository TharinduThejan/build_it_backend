import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Request,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(
    @Request() req: { user: { sub?: string } },
    @Body() dto: CreateOrderDto,
  ) {
    const userId = req.user?.sub;
    if (!userId) throw new UnauthorizedException();
    return this.ordersService.createOrder(userId, dto);
  }

  @Get('my-orders')
  getMyOrders(@Request() req: { user: { sub: string } }) {
    return this.ordersService.getOrdersByUserId(req.user.sub);
  }

  @Get()
  @UseGuards(RolesGuard)
  @Roles('admin')
  getAll() {
    return this.ordersService.getAllOrders();
  }

  @Get(':id')
  getOne(
    @Request() req: { user: { sub?: string; role?: string } },
    @Param('id') id: string,
  ) {
    const { role, sub } = req.user;
    if (!role || !sub) throw new UnauthorizedException();
    return this.ordersService.getOrderById(id, { role, sub });
  }

  @Patch(':id/status')
  @UseGuards(RolesGuard)
  @Roles('admin')
  updateStatus(@Param('id') id: string, @Body() dto: UpdateOrderStatusDto) {
    return this.ordersService.updateOrderStatus(id, dto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard)
  @Roles('admin')
  delete(@Param('id') id: string) {
    return this.ordersService.deleteOrder(id);
  }
}
