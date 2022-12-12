type BaseError<TCode extends string> = {
  readonly type: 'InfrastructureFailure'
  readonly code: TCode
  readonly message?: string
}

type GetUserPurchasesError = BaseError<'GetUserPurchasesError'>
type UserPurchasesNotFound = BaseError<'UserPurchasesNotFound'>

export type DatabaseOperationError = GetUserPurchasesError | UserPurchasesNotFound
