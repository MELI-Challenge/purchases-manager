import { Failure, Result, ResultPromise, Success } from '@src/utils/result'
import { get, isEmpty } from 'lodash'
import { PurchaseModel } from '../input/purchases/interfaces'
import { databaseOperationErrorHandler } from './errors/error-handler'
import { DatabaseOperationError } from './errors/interfaces'
import MockUtils from './mocks'

export interface MakeMockDBOperations {
  getUserPurchases: (userId: string) => ResultPromise<PurchaseModel[], DatabaseOperationError>
}

export const loadMockDBClient = (): Result<MockUtils, unknown> => {
  const mockUtils = new MockUtils()
  return Success(mockUtils)
}

const handleDatabaseSuccess = <T>(r: any, notFoundHandler: () => DatabaseOperationError) => {
  return isEmpty(r) ? Failure<T, DatabaseOperationError>(notFoundHandler()) : Success<T, DatabaseOperationError>(r)
}

const handleDatabaseError = <T>(
  e: any,
  notFoundHandler: () => DatabaseOperationError,
  errorHandler: () => DatabaseOperationError
) => {
  const status = get(e, 'status')
  const error = status === 404 ? notFoundHandler() : errorHandler()
  return Failure<T, DatabaseOperationError>(error)
}

export const makeMockDBOperations = (mockUtils: MockUtils): MakeMockDBOperations => {
  const getUserPurchases = (userId: string): ResultPromise<PurchaseModel[], DatabaseOperationError> => {
    return ResultPromise.fromPromise<PurchaseModel[], DatabaseOperationError>(
      Promise.resolve(
        mockUtils
          .getUserPurchases(userId)
          .then((r) => handleDatabaseSuccess<PurchaseModel[]>(r, databaseOperationErrorHandler.onUserPurchasesNotFound))
          .catch((e) =>
            handleDatabaseError<PurchaseModel[]>(
              e,
              databaseOperationErrorHandler.onUserPurchasesNotFound,
              databaseOperationErrorHandler.onGetUserPurchasesError
            )
          )
      )
    )
  }

  return {
    getUserPurchases
  }
}
