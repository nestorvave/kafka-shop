import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { Kafka, Consumer } from 'kafkajs';
import { OrderService } from '../../domain/order.service';
import { OrderStatus } from '../../domain/order.entity';

@Injectable()
export class OrdersKafkaConsumer implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(OrdersKafkaConsumer.name);
  private consumer: Consumer;

  constructor(private readonly orderService: OrderService) {
    const kafka = new Kafka({
      clientId: 'order-service-consumer',
      brokers: [process.env.KAFKA_BROKER || 'localhost:29092'],
    });

    this.consumer = kafka.consumer({ groupId: 'order-consumers' });
  }

  async onModuleInit() {
    await this.consumer.connect();
    await this.consumer.subscribe({
      topic: 'payments.processed',
      fromBeginning: false,
    });

    await this.consumer.run({
      eachMessage: async ({ message }) => {
        const data = JSON.parse(message.value.toString());
        this.logger.log(`📨 Payment received → order ${data.orderId} → ${data.status}`);

        // map payment status to order status
        const orderStatus = data.status === 'APPROVED'
          ? OrderStatus.CONFIRMED
          : OrderStatus.CANCELLED;

        await this.orderService.updateStatus(data.orderId, orderStatus);
      },
    });

    this.logger.log('✅ Kafka consumer connected → payments.processed');
  }

  async onModuleDestroy() {
    await this.consumer.disconnect();
  }
}