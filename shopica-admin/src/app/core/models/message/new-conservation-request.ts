import { UserMessage } from './user-message';
export interface ConservationRequest {
  customer: UserMessage;
  seller: UserMessage;
}
