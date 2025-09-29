export class RemoveParticipantPayload {
  constructor(
    public readonly conversationId: string,
    public readonly removedBy: string,
    public readonly removedUser: string
  ){}
}