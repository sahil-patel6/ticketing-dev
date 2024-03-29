import express from 'express';
import cookieSession from 'cookie-session';
import 'express-async-errors';

import { currentUser, errorHandler, NotFoundError } from '@ticketing-ms-sp/common';
import { createTicketRouter } from './routes/new';
import { showTicketRouter } from './routes/show';
import { getAllTicketsRouter } from './routes';
import { updateTicketRouter } from './routes/update';


const app = express();
app.set('trust proxy', true)
app.use(express.json());
app.use(cookieSession({
  signed: false,
  secure: process.env.NODE_ENV !== 'test',
}))
app.use(currentUser)

app.use(createTicketRouter)
app.use(showTicketRouter)
app.use(getAllTicketsRouter);
app.use(updateTicketRouter);

app.all("*", async (req, res, next) => {
  throw new NotFoundError()
})
app.use(errorHandler);

export { app }