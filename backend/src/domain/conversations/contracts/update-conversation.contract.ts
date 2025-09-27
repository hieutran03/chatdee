export class UpdateConversationContract{
  constructor(
    public readonly title?: string,
    public readonly theme?: string,
    public readonly avatar?: string
  ) {}
}