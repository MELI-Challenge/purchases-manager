import { Purchase } from '@src/app/domain/entities/purchase'
import { Failure, Result, ResultPromise } from '@src/utils/result'
import { validateSchema, ValidateSchemaError } from '@src/utils/schema'
import { PurchaseModel } from './interfaces'
import { paymentValidateSchema } from './schemas'

const mapPurchase = (purchaseModels: PurchaseModel[]) => {
  return purchaseModels.map((purchaseModel) =>
    validateSchema(paymentValidateSchema, purchaseModel)
      .mapFailure((e) => e)
      .map<Purchase>((r) => ({
        id: r.id_compra,
        title: r.titulo,
        price: {
          total: r.precio.total,
          currency: r.precio.moneda
        },
        quantity: r.cantidad,
        date: r.fecha,
        imageUrl: r.imagen,
        seller: {
          id: r.vendedor.id,
          nickname: r.vendedor.nickname
        },
        transactionId: r.id_transaccion,
        shipmentId: r.id_envio
      }))
  )
}

export const tryToMapPurchases = (purchaseModels: PurchaseModel[]): ResultPromise<Purchase[], ValidateSchemaError> => {
  return ResultPromise.fromResult(Result.bindArray(mapPurchase(purchaseModels)))
}
