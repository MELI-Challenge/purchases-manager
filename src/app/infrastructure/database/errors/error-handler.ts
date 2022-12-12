import { DatabaseOperationError } from './interfaces'

export const databaseOperationErrorHandler = {
  onGetUserPurchasesError: (): DatabaseOperationError => {
    console.error('[InfrastructureFailure] GetUserPurchasesError')
    return {
      type: 'InfrastructureFailure',
      code: 'GetUserPurchasesError'
    }
  },
  onUserPurchasesNotFound: (): DatabaseOperationError => {
    console.error('[InfrastructureFailure] UserPurchasesNotFound')
    return {
      type: 'InfrastructureFailure',
      code: 'UserPurchasesNotFound'
    }
  }
}
