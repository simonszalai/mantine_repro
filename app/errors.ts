export class PrismaError extends Error {
  details: string

  constructor(message: string, details: string) {
    super(message)
    this.name = 'PrismaError'
    this.details = details
  }
}

export const getErrorMessage = (error: unknown) => {
  if (error instanceof Error) return error.message
  return String(error)
}
