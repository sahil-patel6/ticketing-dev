import { Publisher, Subjects, TicketCreatedEvent } from "@ticketing-ms-sp/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}