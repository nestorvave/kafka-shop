import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class OrdersService {
  private readonly orderServiceUrl: string;

  constructor(
    private readonly http: HttpService, // cliente HTTP para llamar a otros servicios
    private readonly config: ConfigService, // lee las variables de entorno
  ) {
    // lee ORDER_SERVICE_URL del .env
    // así si el url cambia, solo cambias el .env
    this.orderServiceUrl = this.config.get<string>('ORDER_SERVICE_URL');
  }

  async createOrder(dto: any) {
    // http.post devuelve un Observable (RxJS)
    // firstValueFrom lo convierte a Promise para poder usar await
    const { data } = await firstValueFrom(
      this.http.post(`${this.orderServiceUrl}/orders`, dto),
    );
    return data; // regresa solo el body de la respuesta
  }

  async getOrders() {
    const { data } = await firstValueFrom(
      this.http.get(`${this.orderServiceUrl}/orders`),
    );
    return data;
  }
}
