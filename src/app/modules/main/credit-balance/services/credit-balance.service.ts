import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})

export class CreditBalanceService {
    constructor(private http: HttpClient) {

    }

    getReportCreditPurchaseHistory() {
        return this.http.get(`${environment.getReportCreditPurchaseHistory}`);
    }

    getReportCreditBalance() {
        return this.http.get(`${environment.getReportCreditBalance}`);
    }
}