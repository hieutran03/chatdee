export class AddParticipantPayload {
  constructor(
    public readonly conversationId: string,
    public readonly addedBy: string,
    public readonly addedUser: string
  ){}
}