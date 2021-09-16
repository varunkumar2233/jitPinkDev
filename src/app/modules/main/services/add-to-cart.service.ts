import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';

@Injectable({   
    providedIn: 'root'
})

export class addToCartServie {
    constructor(private http: HttpClient) {

    }
    addReporttoCart(request) {
        return this.http.post(`${environment.addReportToCart}`,request);
    }
    displayCartData()
    { 
        return this.http.get(`${environment.getCartData}`);
    }
    deleteReportFromCart(id)
    {
        return this.http.patch(`${environment.deleteReportsfromCart}`,id);
    }
    addCreditToCartDB(request)
    {
        return this.http.patch(`${environment.updateCredits}`,request);
    }
    getOrderSummary(order_id)
    {
        return this.http.get(`${environment.getOrderSummary}` + order_id + '/' + `${environment.securekey}`);
    }
  //  https://func-riskportalapi-dev-01.azurewebsites.net/report/generate/461/?code=$ecureKeyDevPinkerton1
    genrateReport(id)
    {
        return this.http.post(`${environment.getrateReport}` + id + '/' + `${environment.securekey}`,'');
    }

    addSampleReport(request)
    {
        return this.http.post(`${environment.addSampleReport}`,request);
    }
}