import { DatabaseOperationError } from '@src/app/infrastructure/database/errors/interfaces'
import { HttpStatusCode } from './httpStatusCodes'
import { ValidateSchemaError } from './schema'

export enum ErrorsResponseCodes {
  ValidateSchemaError = HttpStatusCode.BadRequest,
  GetUserPurchasesError = HttpStatusCode.InternalServerError,
  UserPurchasesNotFound = HttpStatusCode.NotFound,
  Unknown = HttpStatusCode.InternalServerError
}

type ErrorCodes = 'ValidateSchemaError' | 'GetUserPurchasesError' | 'UserPurchasesNotFound' | 'Unknown'

export const getErrorStatusCode = (code: ErrorCodes) => {
  return ErrorsResponseCodes[code as keyof typeof ErrorsResponseCodes]
}
