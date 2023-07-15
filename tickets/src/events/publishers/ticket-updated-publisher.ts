import { Publisher, Subjects, TicketUpdatedEvent } from "@ticketing-ms-sp/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}