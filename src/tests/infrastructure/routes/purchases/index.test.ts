import { loadApp } from '@src/app'
import express from 'express'
import supertest from 'supertest'
import { mock } from 'jest-mock-extended'
import MockUtils from '@src/app/infrastructure/database/mocks'
import { Purchase } from '@src/app/domain/entities/purchase'
import { PurchaseModel } from '@src/app/infrastructure/input/purchases/interfaces'
import { HttpStatusCode } from '@src/utils/httpStatusCodes'
import { cloneDeep, set } from 'lodash'

const dummyPurchasesModel: PurchaseModel[] = [
  {
    id_compra: 300200,
    titulo: 'Celular LG K40',
    precio: {
      total: 105000.0,
      moneda: 'ARS'
    },
    cantidad: 3,
    fecha: '2022-07-25T10:23:18.000-03:00',
    imagen: 'dummyImageURL',
    vendedor: {
      id: 4010,
      nickname: 'FAROCUDR19'
    },
    id_transaccion: 7010200,
    id_envio: 1000010200
  }
]
const dummyPurchasesDomain: Purchase[] = [
  {
    id: 300200,
    title: 'Celular LG K40',
    price: {
      total: 105000.0,
      currency: 'ARS'
    },
    quantity: 3,
    date: '2022-07-25T10:23:18.000-03:00',
    imageUrl: 'dummyImageURL',
    seller: {
      id: 4010,
      nickname: 'FAROCUDR19'
    },
    transactionId: 7010200,
    shipmentId: 1000010200
  }
]

const setAPIRoute = (userId: string) => `/api/v1/user/${userId}/purchases`

describe('Client route', () => {
  const app = express()
  const router = express.Router()
  const mockClient = mock<MockUtils>()
  const server = loadApp(app, router, mockClient)
  jest.spyOn(global.console, 'error').mockImplementation(() => {})

  beforeEach(() => {})

  afterEach(() => {})
  it('Should return payment data and status 200', async () => {
    const apiRoute = setAPIRoute('1')
    mockClient.getUserPurchases.mockImplementation(() => Promise.resolve(dummyPurchasesModel))

    const request = supertest(server)
    await request
      .get(apiRoute)
      .expect(200)
      .then((response) => {
        expect(response.body).toStrictEqual(dummyPurchasesDomain)
      })
  })
  it('Should return an error and 404 if no payment found', async () => {
    const apiRoute = setAPIRoute('1')
    mockClient.getUserPurchases.mockImplementation(() => Promise.resolve([]))

    const request = supertest(server)
    await request
      .get(apiRoute)
      .expect(404)
      .then((response) => {
        expect(response.body.code).toBe('UserPurchasesNotFound')
      })
  })
  it('Should return an error and 500 if error is thrown and no status is set', async () => {
    const apiRoute = setAPIRoute('1')
    let error = new Error()
    mockClient.getUserPurchases.mockImplementation(() => Promise.reject(error))

    const request = supertest(server)
    await request
      .get(apiRoute)
      .expect(500)
      .then((response) => {
        expect(response.body.code).toBe('GetUserPurchasesError')
      })
  })

  it('Should return an error and 500 if schema validation fails', async () => {
    const apiRoute = setAPIRoute('1')
    const dummyBadFormat = cloneDeep(dummyPurchasesModel)
    dummyBadFormat[0].cantidad = undefined as any
    mockClient.getUserPurchases.mockImplementation(() => Promise.resolve(dummyBadFormat))

    const request = supertest(server)
    await request
      .get(apiRoute)
      .expect(HttpStatusCode.BadRequest)
      .then((response) => {
        expect(response.body.code).toBe('ValidateSchemaError')
      })
  })

  it('Should return the error code if not found', async () => {
    const apiRoute = setAPIRoute('1')
    let error = new Error('Not found')
    set(error, 'status', 404)
    mockClient.getUserPurchases.mockImplementation(() => Promise.reject(error))

    const request = supertest(server)
    await request
      .get(apiRoute)
      .expect(HttpStatusCode.NotFound)
      .then((response) => {
        expect(response.body.code).toBe('UserPurchasesNotFound')
      })
  })
})
