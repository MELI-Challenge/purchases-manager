import { loadApp } from '@src/app'
import MockUtils from '@src/app/infrastructure/database/mocks'
import express from 'express'
import { mock } from 'jest-mock-extended'
import supertest from 'supertest'

const dummyHealth = {
  imAlive: true
}

describe('Client route', () => {
  const app = express()
  const router = express.Router()
  const mockClient = mock<MockUtils>()
  const server = loadApp(app, router, mockClient)
  const apiRoute = '/health'

  beforeEach(() => {})

  afterEach(async () => {})
  it('Should health data and status 200', async () => {
    const request = supertest(server)
    await request
      .get(apiRoute)
      .expect(200)
      .then((response) => {
        expect(response.body).toStrictEqual(dummyHealth)
      })
  })
})
