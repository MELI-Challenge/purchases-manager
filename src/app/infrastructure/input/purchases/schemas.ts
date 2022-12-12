import joi from '@hapi/joi'
import { PriceModel, PurchaseModel, SellerModel } from './interfaces'

const priceModelValidateSchema = joi.object<PriceModel>({
  total: joi.number().required(),
  moneda: joi.string().required()
})
const sellerModelValidateSchema = joi.object<SellerModel>({
  id: joi.number().required(),
  nickname: joi.string().required()
})

export const paymentValidateSchema = joi.object<PurchaseModel>({
  id_compra: joi.number().required(),
  titulo: joi.string().required(),
  precio: priceModelValidateSchema,
  cantidad: joi.number().required(),
  fecha: joi.string().required(),
  imagen: joi.string().required(),
  vendedor: sellerModelValidateSchema,
  id_transaccion: joi.number().required(),
  id_envio: joi.number().required()
})
