import { AddParticipantPayload } from "../payload/add-participant.payload";
import { RemoveParticipantPayload } from "../payload/remove-participant.payload";

export const IChatNotifierToken = 'IChatNotifier';
export interface IChatNotifier {
  addParticipant(payload: AddParticipantPayload): void;
  removeParticipant(payload: RemoveParticipantPayload): void;
}