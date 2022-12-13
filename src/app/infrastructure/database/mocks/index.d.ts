import { PurchaseModel } from '../../input/purchases/interfaces'

export default class MockUtils {
  private _readJSON(
    jsonFile: Record<string, any>,
    parameter: string | null,
    timeout: number,
    notFoundErrorMessage: string
  ): Promise<any>
  getUserPurchases(userId: string): Promise<PurchaseModel[]>
}
