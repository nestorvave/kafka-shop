export enum OrderStatus {
  PENDING   = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
}

export class Order {
  id: string;
  userId: string;
  total: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
}