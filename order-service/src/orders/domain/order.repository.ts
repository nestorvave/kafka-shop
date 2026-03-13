import { Order } from './order.entity';

export interface OrderRepository {
  save(order: Order): Promise<Order>;
  findAll(): Promise<Order[]>;
  findById(id: string): Promise<Order | null>;
}

export const ORDER_REPOSITORY = 'OrderRepository';