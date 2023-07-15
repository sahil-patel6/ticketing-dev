import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Order } from '../../models/order';
import { OrderStatus } from '@ticketing-ms-sp/common';
import { stripe } from '../../stripe';
import { Payment } from '../../models/payment';

// jest.mock('../../stripe')

it('returns 404 when purchasing the order does not exist', async () => {

  await request(app)
    .post('/api/payments')
    .set('Cookie', signin())
    .send({
      token: 'asdad',
      orderId: new mongoose.Types.ObjectId().toHexString()
    }).expect(404)

})

it('returns 401 when purchasing the order does not belonging to the user', async () => {

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    price: 20,
    status: OrderStatus.Created
  })

  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', signin())
    .send({
      token: 'asdad',
      orderId: order.id
    }).expect(401)
})


it('returns 400 when purchasing the cancelled order', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString()

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price: 20,
    status: OrderStatus.Cancelled
  })

  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', signin(userId))
    .send({
      token: 'asdad',
      orderId: order.id
    }).expect(400)

})

it('returns 201 with valid input', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString()
  const price = Math.floor(Math.random() * 100000);
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId,
    version: 0,
    price,
    status: OrderStatus.Created
  })

  await order.save();

  await request(app)
    .post('/api/payments')
    .set('Cookie', signin(userId))
    .send({
      token: 'tok_visa',
      orderId: order.id
    }).expect(201)


  const stripeCharges = await stripe.charges.list({ limit: 50 })
  const stripeCharge = stripeCharges.data.find(charge => {
    return charge.amount === price
  })
  expect(stripeCharge).toBeDefined()
  expect(stripeCharge?.currency).toEqual('inr')

  const payment = await Payment.findOne({
    orderId: order.id,
    stripeId: stripeCharge?.id
  })

  expect(payment).not.toBeNull();

})