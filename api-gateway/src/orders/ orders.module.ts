import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios'; 
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';

@Module({
  imports: [
    HttpModule, // le da acceso a HttpService para hacer peticiones HTTP
  ],
  controllers: [OrdersController], // maneja las rutas
  providers: [OrdersService],      // lógica de negocio del gateway
})
export class OrdersModule {}
