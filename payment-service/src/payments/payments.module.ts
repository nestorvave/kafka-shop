import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentTypeormEntity } from './infrastructure/persistence/payment.typeorm.entity';
import { PaymentTypeormRepository } from './infrastructure/persistence/payment.typeorm.repository';
import { PaymentService } from './domain/payment.service';

import { PAYMENT_REPOSITORY } from './domain/payment.repository';
import { PaymentsKafkaController } from './infrastructure/kafka/payments.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PaymentTypeormEntity])],
  controllers: [PaymentsKafkaController],
  providers: [
    PaymentService,
    {
      provide: PAYMENT_REPOSITORY,
      useClass: PaymentTypeormRepository,
    },
  ],
})
export class PaymentsModule {}