import { Payment } from './payment.entity';

export interface PaymentRepository {
  save(payment: Payment): Promise<Payment>;
  findByOrderId(orderId: string): Promise<Payment | null>;
}

export const PAYMENT_REPOSITORY = 'PaymentRepository';