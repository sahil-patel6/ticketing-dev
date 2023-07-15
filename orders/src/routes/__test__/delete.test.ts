import { app } from "../../app";
import request from 'supertest';
import { Ticket } from "../../models/ticket";
import { OrderStatus } from "@ticketing-ms-sp/common";
import { natsWrapper } from "../../nats-wrapper";
import mongoose from "mongoose";

it('marks an order as cancelled', async ()=>{
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'cocert',
    price: 20
  })
  await ticket.save();

  const user = signin();

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201)

  const { body: cancelledOrder } = await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(200)

  expect(order.id).toEqual(cancelledOrder.id)
  expect(cancelledOrder.status).toEqual(OrderStatus.Cancelled)

})

it('emits order cancelled event', async ()=>{
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'cocert',
    price: 20
  })
  await ticket.save();

  const user = signin();

  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201)

  const { body: cancelledOrder } = await request(app)
    .delete(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send()
    .expect(200)

    expect(natsWrapper.client.publish).toBeCalled()
})