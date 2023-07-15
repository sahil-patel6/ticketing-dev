import { Publisher, Subjects, PaymentCreatedEvent } from "@ticketing-ms-sp/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent>{

  readonly subject = Subjects.PaymentCreated;

}
