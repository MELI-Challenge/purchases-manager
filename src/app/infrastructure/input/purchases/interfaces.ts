export interface SellerModel {
  id: number
  nickname: string
}

export interface PriceModel {
  total: number
  moneda: string
}

export interface PurchaseModel {
  id_compra: number
  titulo: string
  precio: PriceModel
  cantidad: number
  fecha: string
  imagen: string
  vendedor: SellerModel
  id_transaccion: number
  id_envio: number
}
