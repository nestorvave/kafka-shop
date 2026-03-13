import { Injectable, Inject, Logger } from '@nestjs/common';
import { Order, OrderStatus } from './order.entity';
import { OrderRepository, ORDER_REPOSITORY } from './order.repository';
import { KafkaProducerService } from 'kafka/kafka-producer.service';


@Injectable()
export class OrderService {
  private readonly logger = new Logger(OrderService.name);

  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: OrderRepository,
    private readonly kafkaProducer: KafkaProducerService,
  ) {}

  async createOrder(userId: string, total: number): Promise<Order> {
    const order = new Order();
    order.userId    = userId;
    order.total     = total;
    order.status    = OrderStatus.PENDING;
    order.createdAt = new Date();
    order.updatedAt = new Date();

    const savedOrder = await this.orderRepository.save(order);

    await this.kafkaProducer.emit('orders.created', {
      orderId:   savedOrder.id,
      userId:    savedOrder.userId,
      total:     savedOrder.total,
      status:    savedOrder.status,
      createdAt: savedOrder.createdAt,
    });

    return savedOrder;
  }

  async getOrders(): Promise<Order[]> {
    return this.orderRepository.findAll();
  }

  // updates order status when payment is processed
  async updateStatus(orderId: string, status: OrderStatus): Promise<void> {
    const order = await this.orderRepository.findById(orderId);

    if (!order) {
      this.logger.warn(`Order ${orderId} not found`);
      return;
    }

    order.status    = status;
    order.updatedAt = new Date();

    await this.orderRepository.save(order);
    this.logger.log(`Order ${orderId} → ${status}`);
  }
}