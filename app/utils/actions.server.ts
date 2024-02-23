import { Submission } from '@conform-to/react'
import { parse } from '@conform-to/zod'
import { TypedResponse, json } from '@remix-run/node'
import { ZodType } from 'zod'

type ValidSubmission<PayloadType> = {
  intent: string
  payload: PayloadType
  error: {}
  value: PayloadType // Explicitly non-nullable
}

type InvalidSubmission<PayloadType> = {
  intent: string
  payload: PayloadType
  error: Record<string, string[]>
  value?: null
}

export type ActionResponse<PayloadType = any> = TypedResponse<{
  status: string
  submission: ValidSubmission<PayloadType> | InvalidSubmission<PayloadType>
  message?: string
  details?: string
}>

export const getMethodNotAllowedResponse = (method: string): ActionResponse => {
  return json({
    status: 'error',
    message: 'Request to backend failed',
    details: `Method ${method} not allowed. Only use POST or GET, since before Remix loads, the browser can't handle other types.`,
    submission: {
      intent: '',
      payload: {},
      error: {
        '': [`Method ${method} not allowed`],
      },
    },
  })
}

export const getValidationErrorResponse = (submission: Submission<any>): ActionResponse => {
  const errorKeys = Object.keys(submission.error)
  console.error('Submission validation failed. Submission:', submission)
  const details = errorKeys.map((key) => `${key}: ${submission.error[key].join(', ')}`).join('; ')
  return json({ status: 'error', message: 'Parsing action payload failed', details, submission })
}

export const getPrismaErrorResponse = (submission: Submission<any>, e: any): ActionResponse => {
  console.error('Database error:', e)
  console.error('Submission:', submission)
  return json({
    status: 'error',
    message: 'Database operation failed',
    details: 'See console for more info',
    submission,
  })
}

type ActionRequestResult<PayloadType extends ZodType<any>> =
  | { type: 'valid'; validSubmission: ValidSubmission<PayloadType['_output']> }
  | { type: 'error'; errorResponse: ActionResponse }

export const validateActionRequest = async <PayloadType extends ZodType<any>>(
  request: Request,
  schema: PayloadType,
): Promise<ActionRequestResult<PayloadType>> => {
  if (request.method.toUpperCase() !== 'POST') {
    return { type: 'error', errorResponse: getMethodNotAllowedResponse(request.method) }
  }

  const formData = await request.formData()
  const submission = parse(formData, { schema })

  if (!submission.value) {
    const validationError = getValidationErrorResponse(submission)
    return { type: 'error', errorResponse: validationError }
  }

  return { type: 'valid', validSubmission: { ...submission, value: submission.value } }
}
