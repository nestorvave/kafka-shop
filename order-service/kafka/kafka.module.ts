import { Module, Global } from '@nestjs/common';
import { KafkaProducerService } from './kafka-producer.service';

// @Global() → hace que KafkaProducerService esté disponible en toda la app
// sin necesidad de importar KafkaModule en cada módulo que lo necesite
@Global()
@Module({
  providers: [KafkaProducerService],
  exports: [KafkaProducerService], // lo exportamos para que otros módulos lo puedan inyectar
})
export class KafkaModule {}