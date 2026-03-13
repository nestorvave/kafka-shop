import { Controller, Post, Get, Body } from '@nestjs/common';
import { OrderService } from '../../domain/order.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  create(@Body() dto: CreateOrderDto) {
    return this.orderService.createOrder(dto.userId, dto.total);
  }

  @Get()
  findAll() {
    return this.orderService.getOrders();
  }
}