import { Controller, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { Kafka, Consumer } from 'kafkajs';
import { PaymentService } from '../../domain/payment.service';

@Controller()
export class PaymentsKafkaController implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PaymentsKafkaController.name);
  private consumer: Consumer;

  constructor(private readonly paymentService: PaymentService) {
    const kafka = new Kafka({
      clientId: 'payment-service',
      brokers: [process.env.KAFKA_BROKER || 'localhost:29092'],
    });

    this.consumer = kafka.consumer({ groupId: 'payment-consumers' });
  }

  async onModuleInit() {
    await this.consumer.connect();
    await this.consumer.subscribe({
      topic: 'orders.created',
      fromBeginning: false,
    });

    await this.consumer.run({
      eachMessage: async ({ message }) => {
        const data = JSON.parse(message.value.toString());
        this.logger.log(`📨 Orden recibida → ${data.orderId}`);
        await this.paymentService.processPayment(data.orderId, data.total);
      },
    });

    this.logger.log('✅ Kafka consumer conectado → orders.created');
  }

  async onModuleDestroy() {
    await this.consumer.disconnect();
  }
}