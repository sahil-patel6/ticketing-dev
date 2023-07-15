import { Publisher, Subjects, OrderCancelledEvent } from "@ticketing-ms-sp/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent>{

  readonly subject = Subjects.OrderCancelled;

}