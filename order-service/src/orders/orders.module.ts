import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderTypeormEntity } from './infrastructure/persistence/order.typeorm.entity';
import { OrderTypeormRepository } from './infrastructure/persistence/order.typeorm.repository';
import { OrderService } from './domain/order.service';
import { OrdersController } from './infrastructure/http/orders.controller';
import { ORDER_REPOSITORY } from './domain/order.repository';
import { OrdersKafkaConsumer } from './infrastructure/kafka/orders.kafka.consumer';

@Module({
  imports: [TypeOrmModule.forFeature([OrderTypeormEntity])],
  controllers: [OrdersController],
  providers: [
    OrderService,
    OrdersKafkaConsumer,

    // Aquí le decimos a NestJS:
    // "cuando alguien pida OrderRepository, dale OrderTypeormRepository"
    {
      provide: ORDER_REPOSITORY,
      useClass: OrderTypeormRepository,
    },
  ],
})
export class OrdersModule {}