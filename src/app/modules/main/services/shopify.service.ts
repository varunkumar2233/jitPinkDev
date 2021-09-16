import { HttpClient } from '@angular/common/http'
import { Injectable } from '@angular/core'
import Client from 'shopify-buy'
import { environment } from '../../../../environments/environment'
import { AuthService } from '../../auth/service/auth.service'


@Injectable({
  providedIn: 'root'
})
export class ShopifyService {
  client: Client.Client
  products: Array<any>

  constructor(private http: HttpClient, private auth: AuthService) {
    const { domain, storefrontAccessToken } = environment.shopify
    this.client = Client.buildClient({ domain, storefrontAccessToken })
  }

  /**
   * Fetch and return the list of available products
   * @returns available products
   */
  async getProducts() {
    if (this.products) return this.products
    this.products = await this.client.product.fetchAll()
    return this.products
  }

  /**
   * Get the authenticated checkout url for the authenticated user.
   * The user should be redirected to the returned url when they're ready to check out.
   * NOTE: this should be called when the user clicks the checkout button, as the url can expire.
   * The returned url can only be used once.
   * This fetches the user's cart and creates a Shopify checkout based on that.
   * The checkout url is then passed to the multipass url endpoint so that the user is authenticated when they are redirected.
   * @returns the checkout URL for the authenticated user
   */
  async getAuthenticatedCheckoutUrl() {
    const products = await this.getProducts()
    const cart: any = await this.http.get(`${environment.getCartData}`).toPromise()
    const userInfo: any = await this.auth.getUserInfo({}).toPromise()
    const checkout = await this.client.checkout.create({ email: userInfo.email })

    // put credits in checkout
    if (cart.platinum_credits > 0) {
      const product = products.find(e => e.handle === `platinum-credit`)
      const variantId = product.variants[0].id
      await this.client.checkout.addLineItems(
        checkout.id, [{ variantId, quantity: cart.platinum_credits}]
      )
    }
    if (cart.standard_credits > 0) {
      const product = products.find(e => e.handle === `standard-credit`)
      const variantId = product.variants[0].id
      await this.client.checkout.addLineItems(
        checkout.id, [{ variantId, quantity: cart.standard_credits}]
      )
    }

    // put reports in checkout
    for (const report of cart.reports) {
      const product = this.products.filter(e => e.handle === `${report.report_type}-report`)[0]
      const variantId = product.variants[0].id
      // TODO: apparently this will become "properties" when the checkout becomes an order
      const customAttributes = [
        { key: 'Address', value: report.address },
        { key: '_id', value: report.id.toString() },
      ]

      await this.client.checkout.addLineItems(
        checkout.id,
        [{ variantId, quantity: 1, customAttributes }]
      )
    }

    // get authenticated checkout url
    const url = await this.http.get(`${environment.genrateMultipassUrl}`, {
      params: {
        return_to: checkout.webUrl
      }
    }).toPromise()

    return url
  }
}
