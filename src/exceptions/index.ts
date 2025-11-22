export class ValidationError extends Error {
  public messageToUser: string

  constructor(messageToUser: string, errorMessage?: string) {
    super(errorMessage ?? messageToUser)
    this.messageToUser = messageToUser
  }
}
