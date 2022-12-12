import { ApiError, ApiResponse } from '@src/utils/interfaces'
import { Request, Response, Router } from 'express'
import { MakeMockDBOperations } from '../../database'
import { tryToMapPurchases } from '../../input/purchases'
import {
  handleDatabaseOperationError,
  mappingSuccessHandler,
  mappingErrorHandler
} from '../../input/utils/api-responses-handlers'

const getUSerPurchasesHandler = async (req: Request, res: Response, databaseOperations: MakeMockDBOperations) => {
  const { userId } = req.params
  return databaseOperations
    .getUserPurchases(userId)
    .thenMapFailure<ApiError>(handleDatabaseOperationError)
    .thenBindAsync<ApiResponse>((foundPurchases) => {
      return tryToMapPurchases(foundPurchases)
        .thenMap<ApiResponse>(mappingSuccessHandler)
        .thenMapFailure(mappingErrorHandler)
    })
    .then((r) =>
      r.either(
        (apiResponse) => {
          return res.status(apiResponse.status).send(apiResponse.payload)
        },
        (e) => {
          return res.status(e.status).send({
            type: e.type,
            code: e.code
          })
        }
      )
    )
}

export const getUserPurchasesRoute = (router: Router, databaseOperations: MakeMockDBOperations): Router => {
  return router.get('/user/:userId/purchases', (req, res) => getUSerPurchasesHandler(req, res, databaseOperations))
}
