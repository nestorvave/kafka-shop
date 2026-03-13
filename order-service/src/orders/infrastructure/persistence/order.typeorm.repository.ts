import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderRepository } from '../../domain/order.repository';
import { Order } from '../../domain/order.entity';
import { OrderTypeormEntity } from './order.typeorm.entity';

@Injectable()
export class OrderTypeormRepository implements OrderRepository {

  constructor(
    @InjectRepository(OrderTypeormEntity)
    private readonly repo: Repository<OrderTypeormEntity>,
  ) {}

  async save(order: Order): Promise<Order> {
    const saved = await this.repo.save(order);
    return saved as unknown as Order;
  }

  async findAll(): Promise<Order[]> {
    const orders = await this.repo.find();
    return orders as unknown as Order[];
  }

  async findById(id: string): Promise<Order | null> {
    const order = await this.repo.findOne({ where: { id } });
    return order as unknown as Order;
  }
}