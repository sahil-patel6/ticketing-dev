import { Publisher, Subjects, OrderCreatedEvent } from "@ticketing-ms-sp/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent>{

  readonly subject = Subjects.OrderCreated;

}