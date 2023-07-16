import mongoose from 'mongoose';
import { app } from './app';
import { natsWrapper } from './nats-wrapper';
import { TicketCreatedListener } from './events/listeners/ticket-created-listener';
import { TicketUpdatedListener } from './events/listeners/ticket-updated-listener';
import { ExpirationCompleteListener } from './events/listeners/expiration-complete-listener';
import { PaymentCreatedListener } from './events/listeners/payment-created-listener';
const start = async () => {
  console.log("Starting up...")
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY not found')
  }
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI not found')
  }
  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS_CLIENT_ID not found')
  }
  if (!process.env.NATS_URL) {
    throw new Error('NATS_URL not found')
  }
  if (!process.env.NATS_CLUSTER_ID) {
    throw new Error('NATS_CLUSTER_ID not found')
  }

  try {
    await natsWrapper.connect(process.env.NATS_CLUSTER_ID, process.env.NATS_CLIENT_ID, process.env.NATS_URL)
    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed!');
      process.exit()
    })

    process.on('SIGINT', () => natsWrapper.client.close())
    process.on('SIGTERM', () => natsWrapper.client.close())
    process.on('SIGHUP', () => natsWrapper.client.close());

    // listeners
    new TicketCreatedListener(natsWrapper.client).listen()
    new TicketUpdatedListener(natsWrapper.client).listen()
    new ExpirationCompleteListener(natsWrapper.client).listen()
    new PaymentCreatedListener(natsWrapper.client).listen()

    await mongoose.connect(process.env.MONGO_URI)
    console.log("connected to mongodb")
  } catch (err) {
    console.log(err)
  }

  app.listen(3000, () => {
    console.log('Orders Service listening on port 3000')
  })
}

start();
