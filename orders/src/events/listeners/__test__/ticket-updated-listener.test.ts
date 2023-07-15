import { natsWrapper } from "../../../nats-wrapper"
import { TicketUpdatedEvent } from '@ticketing-ms-sp/common';
import { TicketUpdatedListener } from "../ticket-updated-listener"
import mongoose from "mongoose";
import { Message } from "node-nats-streaming";
import { Ticket } from "../../../models/ticket";

const setup = async () => {
  // create an instance of the listener
  const listener = new TicketUpdatedListener(natsWrapper.client)

  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 10,
  })
  await ticket.save();

  // create a fake data event
  const data: TicketUpdatedEvent['data'] = {
    version: ticket.version + 1,
    id: ticket.id,
    title: 'new concert',
    price: 999,
    userId: new mongoose.Types.ObjectId().toHexString()
  }

  // create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn()
  }

  return { listener, ticket, data, msg }
}

it('finds, updates and saves a ticket', async () => {

  const { listener, ticket, data, msg } = await setup();

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg)

  // write assertions to make sure ticket was created
  const updatedTicket = await Ticket.findById(ticket.id)
  expect(updatedTicket).toBeDefined()
  expect(updatedTicket?.title).toBe(data.title)
  expect(updatedTicket?.price).toBe(data.price)
  expect(updatedTicket?.version).toBe(data.version)
})

it('acks the message', async () => {

  const { listener, data, msg } = await setup();

  // call the onMessage function with the data object + message object
  await listener.onMessage(data, msg)

  // write assertions to make sure ack function was called
  expect(msg.ack).toHaveBeenCalled()
})

it('does not call ack if the event has a skipped version number', async () => {

  const { listener, data, msg } = await setup();

  data.version = 10

  // call the onMessage function with the data object + message object
  try{
    await listener.onMessage(data, msg)
  } catch(err){

  }
  
  // write assertions to make sure ack function was called
  expect(msg.ack).not.toHaveBeenCalled()
})
