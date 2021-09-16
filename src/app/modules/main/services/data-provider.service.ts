import { Injectable } from '@angular/core';
import { Observable, Subject,ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class DataProviderService {
  
  private subject = new ReplaySubject<any>();
  private prodObj = new ReplaySubject<any>();
  private cartObj = new ReplaySubject<any>();
  private updateObj = new ReplaySubject<any>();
  private viewCartObj = new ReplaySubject<any>();
  private viewCartNoti = new ReplaySubject<any>();
  private sampleReport = new ReplaySubject<any>();
  
  constructor() { }
  
  storeAvailableReport(availableReport:any){

    this.subject.next(availableReport)
  }
  getAvailableReport(): Observable<any>{
     return this.subject.asObservable();
  }

  saveProductList(availableReport:any)
  {
    this.prodObj.next(availableReport)
  }

  getProductList(): Observable<any>
  {
    return this.prodObj.asObservable();
  }

  addtoCart(obj:any)
  {
    this.cartObj.next(obj)
  }
  getcartData()
  {
    return this.cartObj.asObservable();
  }

  updateCartData(obj:any)
  {
    this.updateObj.next(obj);
  }
  getUpdatedData()
  {
    return this.updateObj.asObservable();
  }
 setViewCartDetailData(obj:any)
 {
  this.viewCartObj.next(obj);
 }
 getViewCartDetailData()
 {
  return this.viewCartObj.asObservable();
 }

 setCartNotificationData(obj:any)
 {
  this.viewCartNoti.next(obj);
 }
 getCartNotificationData()
 {
  return this.viewCartNoti.asObservable();
 }
 storeAvailablesampleReport(availablesampleReport:any){

  this.sampleReport.next(availablesampleReport)
}
getAvailablesampleReport(): Observable<any>{
   return this.sampleReport.asObservable();
}
}
