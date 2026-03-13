import { Injectable, Inject, Logger } from '@nestjs/common';
import { Payment, PaymentStatus } from './payment.entity';
import { PaymentRepository, PAYMENT_REPOSITORY } from './payment.repository';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    @Inject(PAYMENT_REPOSITORY)
    private readonly paymentRepository: PaymentRepository,
  ) {}

  async processPayment(orderId: string, amount: number): Promise<Payment> {
    const payment = new Payment();
    payment.orderId   = orderId;
    payment.amount    = amount;
    payment.createdAt = new Date();

    // simulamos que el 80% de los pagos son aprobados
    // en producción aquí llamarías a Stripe, PayPal, etc.
    const approved = Math.random() > 0.2;
    payment.status = approved ? PaymentStatus.APPROVED : PaymentStatus.REJECTED;

    const saved = await this.paymentRepository.save(payment);

    this.logger.log(`💳 Pago ${payment.status} → orden ${orderId}`);

    return saved;
  }
}