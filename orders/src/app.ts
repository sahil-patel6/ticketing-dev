import express from 'express';
import cookieSession from 'cookie-session';
import 'express-async-errors';

import { currentUser, errorHandler, NotFoundError } from '@ticketing-ms-sp/common';
import { createOrderRouter } from './routes/new';
import { getOrderRouter } from './routes/show';
import { getAllOrdersRouter } from './routes';
import { deleteOrderRouter } from './routes/delete';


const app = express();
app.set('trust proxy', true)
app.use(express.json());
app.use(cookieSession({
  signed: false,
  secure: process.env.NODE_ENV !== 'test',
}))
app.use(currentUser)

app.use(createOrderRouter)
app.use(getOrderRouter)
app.use(getAllOrdersRouter);
app.use(deleteOrderRouter);

app.all("*", async (req, res, next) => {
  throw new NotFoundError()
})
app.use(errorHandler);

export { app }