import { 
  Injectable, 
  OnModuleInit,    // interface que le dice a NestJS "tengo algo que hacer al arrancar"
  OnModuleDestroy, // interface que le dice a NestJS "tengo algo que hacer al apagarse"
  Logger           // logger de NestJS para imprimir mensajes en consola con formato
} from '@nestjs/common';
import { Kafka, Producer } from 'kafkajs'; // Kafka es la conexión principal, Producer es quien envía

@Injectable() // le dice a NestJS que este servicio puede ser inyectado en otros servicios
export class KafkaProducerService implements OnModuleInit, OnModuleDestroy {
  
  // Logger con el nombre de la clase, así en consola sabes de dónde viene el mensaje
  // ejemplo: [KafkaProducerService] ✅ Kafka producer conectado
  private readonly logger = new Logger(KafkaProducerService.name);
  
  // guardamos el producer aquí para usarlo en todos los métodos de la clase
  // es private porque nadie de afuera debe tocarlo directamente
  private producer: Producer;

  constructor() {
    // Kafka es como el "cliente" que sabe dónde está el broker
    // clientId → nombre con el que este servicio se identifica en Kafka UI
    // brokers  → dirección del broker, usamos 29092 porque es el puerto externo (desde tu Mac)
    //            si estuviéramos dentro de Dockers usaríamos kafka:9092
    const kafka = new Kafka({
      clientId: 'order-service',
      brokers: [process.env.KAFKA_BROKER || 'localhost:29092'],
    });

    // kafka.producer() crea el producer pero NO se conecta todavía
    // la conexión real ocurre en onModuleInit
    this.producer = kafka.producer();
  }

  // NestJS llama este método automáticamente cuando la app arranca
  // aquí sí hacemos la conexión real al broker
  async onModuleInit() {
    await this.producer.connect();
    this.logger.log('✅ Kafka producer conectado');
  }

  // NestJS llama este método automáticamente cuando la app se apaga (Ctrl+C)
  // importante: si no desconectamos, dejamos conexiones abiertas en el broker
  // Kafka podría pensar que el producer sigue vivo y eso genera problemas
  async onModuleDestroy() {
    await this.producer.disconnect();
  }

  // método principal que usaremos desde order.service.ts
  // topic   → nombre del canal donde publicamos, ejemplo: 'orders.created'
  // message → el objeto que queremos enviar, puede ser cualquier cosa
  async emit(topic: string, message: any): Promise<void> {
    await this.producer.send({
      topic, // a qué topic mandamos el mensaje
      messages: [
        {
          // Kafka solo entiende bytes/strings, no objetos de JavaScript
          // por eso convertimos el objeto a JSON string con JSON.stringify
          // el consumer lo recibirá como string y lo convertirá de vuelta con JSON.parse
          value: JSON.stringify(message),
        },
      ],
    });

    this.logger.log(`📤 Evento enviado → [${topic}]`);
  }
}