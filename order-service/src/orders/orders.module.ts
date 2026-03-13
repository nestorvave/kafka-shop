import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderTypeormEntity } from './infrastructure/persistence/order.typeorm.entity';
import { OrderTypeormRepository } from './infrastructure/persistence/order.typeorm.repository';
import { OrderService } from './domain/order.service';
import { OrdersController } from './infrastructure/http/orders.controller';
import { ORDER_REPOSITORY } from './domain/order.repository';

@Module({
  imports: [TypeOrmModule.forFeature([OrderTypeormEntity])],
  controllers: [OrdersController],
  providers: [
    OrderService,

    // Aquí le decimos a NestJS:
    // "cuando alguien pida OrderRepository, dale OrderTypeormRepository"
    {
      provide: ORDER_REPOSITORY,
      useClass: OrderTypeormRepository,
    },
  ],
})
export class OrdersModule {}