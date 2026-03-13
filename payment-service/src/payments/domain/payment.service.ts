import { Injectable, Inject, Logger } from '@nestjs/common';
import { Payment, PaymentStatus } from './payment.entity';
import { PaymentRepository, PAYMENT_REPOSITORY } from './payment.repository';
import { KafkaProducerService } from '../infrastructure/kafka/kafka-producer.service';


@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    @Inject(PAYMENT_REPOSITORY)
    private readonly paymentRepository: PaymentRepository,
    private readonly kafkaProducer: KafkaProducerService,
  ) {}

  async processPayment(orderId: string, amount: number): Promise<Payment> {
    const payment = new Payment();
    payment.orderId   = orderId;
    payment.amount    = amount;
    payment.createdAt = new Date();

    const approved = Math.random() > 0.2;
    payment.status = approved ? PaymentStatus.APPROVED : PaymentStatus.REJECTED;

    const saved = await this.paymentRepository.save(payment);

    // publish event after processing
    await this.kafkaProducer.emit('payments.processed', {
      orderId,
      paymentId: saved.id,
      status:    payment.status,
      amount,
    });

    this.logger.log(`💳 Payment ${payment.status} → order ${orderId}`);

    return saved;
  }
}