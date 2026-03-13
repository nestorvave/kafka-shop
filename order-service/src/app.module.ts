import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './orders/domain/order.entity';
import { OrdersModule } from './orders/orders.module';
import { OrderTypeormEntity } from './orders/infrastructure/persistence/order.typeorm.entity';
import { KafkaModule } from 'kafka/kafka.module';


@Module({
  imports: [
    // Lee el archivo .env automáticamente
    ConfigModule.forRoot({ isGlobal: true }),

    // Conecta a PostgreSQL
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        url: config.get<string>('DATABASE_URL'),
        entities: [OrderTypeormEntity],
        synchronize: true, // ⚠️ solo en desarrollo
        logging: true,     // muestra las queries en consola
      }),
    }),
    KafkaModule,
    // Registra el módulo de órdenes
    OrdersModule,
  ],
})
export class AppModule {}