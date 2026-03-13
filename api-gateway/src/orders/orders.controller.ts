import { Controller, Post, Get, Body } from '@nestjs/common';
import { OrdersService } from './orders.service';

// @Controller('orders') → este controlador maneja /api/orders
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  // recibe POST /api/orders y lo delega al servicio
  // @Body() extrae el JSON del request
  @Post()
  create(@Body() dto: any) {
    return this.ordersService.createOrder(dto);
  }

  // recibe GET /api/orders y lo delega al servicio
  @Get()
  findAll() {
    return this.ordersService.getOrders();
  }
}
