import MockUtils from '@src/app/infrastructure/database/mocks'
import { Router } from 'express'
import { makeMockDBOperations } from '../database'
import { getUserPurchasesRoute } from './purchases'

export const routes = (router: Router, mockClient: MockUtils) => {
  const databaseOperations = makeMockDBOperations(mockClient)
  return [getUserPurchasesRoute(router, databaseOperations)]
}
