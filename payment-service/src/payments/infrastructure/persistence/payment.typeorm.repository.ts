import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentRepository } from '../../domain/payment.repository';
import { Payment } from '../../domain/payment.entity';
import { PaymentTypeormEntity } from './payment.typeorm.entity';

@Injectable()
export class PaymentTypeormRepository implements PaymentRepository {

  constructor(
    @InjectRepository(PaymentTypeormEntity)
    private readonly repo: Repository<PaymentTypeormEntity>,
  ) {}

  async save(payment: Payment): Promise<Payment> {
    const saved = await this.repo.save(payment);
    return saved as unknown as Payment;
  }

  async findByOrderId(orderId: string): Promise<Payment | null> {
    const payment = await this.repo.findOne({ where: { orderId } });
    return payment as unknown as Payment;
  }
}