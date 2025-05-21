const amqp = require('amqplib');

class EventBus {
  constructor() {
    this.connection = null;
    this.channel = null;
  }

  async connect() {
    if (!this.connection) {
      this.connection = await amqp.connect('amqp://junedelmar:junedelmar@20.2.196.15:5672/');
      this.channel = await this.connection.createChannel();
      console.log('Connected to RabbitMQ');
    }
  }

  async publish(queue, message) {
    await this.connect();
    await this.channel.assertQueue(queue, { durable: true });
    this.channel.sendToQueue("GrindStack.Orders Received", queue, Buffer.from(JSON.stringify(message)), {
      persistent: true,
    });
    console.log(`Published event to ${queue}`, message);
  }

  async subscribe(queue, handler) {
    await this.connect();
    await this.channel.assertQueue(queue, { durable: true });
    this.channel.consume(queue, (msg) => {
      if (msg !== null) {
        const event = JSON.parse(msg.content.toString());
        console.log(`Received event from ${queue}`, event);
        handler(event);
        this.channel.ack(msg);
      }
    });
  }
}

module.exports = new EventBus();
