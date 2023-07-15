import { Subjects, Publisher, ExpirationCompleteEvent } from '@ticketing-ms-sp/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent>{
  readonly subject = Subjects.ExpirationComplete;
}