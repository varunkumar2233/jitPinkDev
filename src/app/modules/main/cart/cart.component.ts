import { Component, OnInit } from '@angular/core';
import { Options } from '@angular-slider/ngx-slider';
import { addToCartServie } from '../services/add-to-cart.service';
import { SharedService } from '../../shared/services/shared-service.service';
import { AlertServiceService } from '../../shared/services/alert-service.service';
import { ShopifyService } from '../services/shopify.service';
import { DataProviderService } from '../services/data-provider.service';
import { debug } from 'console';
import { takeUntil, timeout } from 'rxjs/operators';
import { Subscription, Subject, Observable } from 'rxjs';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {Location} from '@angular/common';
import { Router } from '@angular/router';
import { IfTermsAcceptedService } from '../../home/if-terms-accepted.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  countryselected!: string;
  selectdrop: any = "Country";
  mx: any = "Afghanistan";
  cartList: Array<any>;
  totalAmount: any;
  itemCount: any;
  standartReportAmount: any;
  wantMoreCredits: boolean = false;
  termsConditionForm: FormGroup;
  isTermsAccepted: boolean = false;
  isActive: Subject<boolean> = new Subject();   // Subject used to take until the component is alive.
  submitted: boolean = false;
  counter: number;
  pageLoadInitialized : boolean = true;
  constructor(private cart_service: addToCartServie,
    private fb: FormBuilder,
    private shared_service: SharedService,
    private alert_service: AlertServiceService,
    private ifTermsAccepted:IfTermsAcceptedService,
    private shopify: ShopifyService,
    private _location: Location,
    private router: Router,
    private date_Provider_Service: DataProviderService) {
    this.date_Provider_Service.getViewCartDetailData().pipe(takeUntil(this.isActive)).subscribe((data: any) => {
      //  this.loadCartData(); 
      this.cartList = data;
      this.itemCount = this.cartList.length;
      this.calculateItemSum();
    });
  }
 
  

  ngOnInit(): void {
    this.ifTermsAccepted.ifTermsAccepted();
    this.InitializeFormCheckbox();
    this.getReportPricesfromShopify();
    setTimeout(() => {
      this.loadCartData();
    }, 1000);  
  }

  InitializeFormCheckbox() {
    this.termsConditionForm = this.fb.group({
      has_agreed_tos: [false, Validators.requiredTrue]
    });
  }
  termsConditionCheck(obj) {
    this.isTermsAccepted = obj.target.checked ? false : true;
  }
  getValue = (item: string) => {
    console.log(item);
    this.selectdrop = item;
  }

  async getReportPricesfromShopify() {
    // const products = await this.shopify.getProducts();
    // this.standartReportAmount = products.find(e => e.handle === `standard-report`).variants[0].price;
    // this.platiumReportAmount = products.find(e => e.handle === `platinum-report`).variants[0].price;

    this.shopify.getProducts().then(data => {
      this.standartReportAmount = data.find(e => e.handle === `standard-report`).variants[0].price;
    });
  }
 
  

  loadCartData() {
    this.shared_service.startLoading();
    this.cart_service.displayCartData().pipe(takeUntil(this.isActive)).subscribe(data => {
      this.myCartList(data);
      if(this.pageLoadInitialized)
      {
        this.counter = data.standard_credits;
      }
      this.date_Provider_Service.updateCartData(this.cartList);
      this.shared_service.stopLoading();
    });
  }


  myCartList(req) {

    var tempArray = [];
    var amount = 0;
    var standardAmount = this.standartReportAmount;
    req.reports.forEach(function (value) { // report data
      tempArray.push(
        {
          "id": value.id,
          "address": value.address, // this will change...
          "report_type": value.report_type,
          "country": value.usa,
          "lon": value.lon,
          "lat": value.lat,
          "geo_id": value.geo_id,
          "price": standardAmount,
          //"price": value.report_type == 'platinum' ? platiumAmount : standardAmount,
          "quantity": '',
          "preview_img": value.preview_img
        }
      );
    });
    // credit data.
    //var premCred = req.platinum_credits;
    var standCred = req.standard_credits;

    if (standCred != 0) {
      var standareCreditRequest = {
        "id": 0,
        "address": '', // this will change...
        "report_type": 'Standard Credits',
        "country": '',
        "lon": '',
        "lat": '',
        "geo_id": '',
        "price": this.getCreditTotalPrice(standCred, 'standard_credits'),
        "quantity": standCred
      };
      tempArray.push(standareCreditRequest);
    }

    this.cartList = tempArray;
    this.itemCount = this.cartList.length;
    console.log("item count in myCart List block" + this.itemCount)
    this.calculateItemSum();
  }

  calculateItemSum() {
    var total = 0;
    var creditAmount = 0;
    var amount = 0;
    //var creditAmounts = this.getCreditTotalPrice(1,2);


    for (var i = 0; i < this.cartList.length; i++) {
      total += parseInt(this.cartList[i].price);
    }
    this.totalAmount = total;

  }
  backClicked() {
    this._location.back();
  }

  getCreditTotalPrice(quantity, credittype) {
    if (credittype === 'standard_credits') {
      if (quantity >= 26 && quantity <= 49) {
        return quantity * 250;

      } else if (quantity >= 50) {
        return quantity * 200;

      } else {
        return quantity * 350;
      }
    }
    else {
      if (quantity >= 26 && quantity <= 49) {
        return quantity * 770;

      } else if (quantity >= 50) {
        return quantity * 615;

      } else {
        return quantity * 1000;
      }
    }
  }
  get f() { return this.termsConditionForm.controls; }
  checkoutfinal() {
    this.submitted = true;
    if (this.termsConditionForm.controls.has_agreed_tos.value === true && !this.termsConditionForm.invalid) {
      this.shared_service.startLoading();
      this.alert_service.success('We are redirecting you to payment page');
      this.shopify.getAuthenticatedCheckoutUrl().then(data =>
        //console.log((<any>data).url)
        window.open((<any>data).url, '_self')
      ).catch(function (error) {
        // TODO: This can fail if the user has not agreed to the TOS. Handle errors here.
        this.alertService.error("Error: Systmem Validaton Error");
        //alert('error');
        this.shared_service.stopLoading();
        // Catch and handle exceptions from success/error/finally functions
      });
    }
    else {
      return
    }


    // this.shared_service.stopLoading();
  }

  incrementCreditQuantity(){
    if(this.counter<100){
    this.counter = this.counter+1;
    this.incrementDecrementCreditQuantity(this.counter);  
    }else if(this.counter==100){
this.wantMoreCredits = true;

    }
  }

  decrementCreditQuantity(){
    if(this.counter == 1){
      this.deleteReportFromCartLatest(0, 'Standard Credits');
      return;
    }
    this.counter = this.counter-1;
    this.wantMoreCredits = false;
    this.incrementDecrementCreditQuantity(this.counter);
  }
  
  incrementDecrementCreditQuantity(incremeter: number){
    this.pageLoadInitialized = false;
    this.shared_service.startLoading();
    var standObj = {
      "standard_credits": incremeter
    };
    if(incremeter !== 0)
    {
      this.addUpdateCreditToCartDB(standObj);
      setTimeout(() => {
        this.loadCartData();
      }, 1000);       
      this.shared_service.stopLoading();

    }else{
      this.shared_service.startLoading();
      this.deleteReportFromCart(0);
      setTimeout(() => {
      this.loadCartData();
    }, 1000); 
      window.location.reload();
      
    }
  }

    addUpdateCreditToCartDB(reportsdata) {
    this.shared_service.startLoading();
    this.cart_service.addCreditToCartDB(reportsdata).pipe(takeUntil(this.isActive)).subscribe(
      data =>{
        console.log("response after deleting credit " + "" + data )
    },
    error => {
      this.alert_service.error('error while upsating quantity of credit.');
    });
  }

  deleteReportFromCart(id) {
    var removeCredObj = {
       "standard_credits": [id]
     };
   let indexcredit = this.cartList.findIndex(x => x.id === id);
   if (indexcredit > -1) {
     this.cartList.splice(indexcredit, 1);
     this.itemCount = this.cartList.length;
     console.log("item count in delete report from cart block" + this.itemCount)
     this.calculateItemSum();
     this.addUpdateCreditToCartDB(removeCredObj);
   }
 this.date_Provider_Service.setViewCartDetailData(this.cartList);
}


deleteReportFromCartLatest(id, type) {
  this.shared_service.startLoading();
  console.log("Value of ID " + " " + id + " " + type);
  if (type === 'Standard Credits' || type === 'standard_credits') {
    var removeCredObj = {
        "standard_credits": 0
      };

    let indexcredit = this.cartList.findIndex(x => x.id === id);
    if (indexcredit > -1) {
      this.cartList.splice(indexcredit, 1);
      this.itemCount = this.cartList.length;
      console.log("item count in first if block" + this.itemCount)
      this.calculateItemSum();
      this.addUpdateCreditToCartDB(removeCredObj);
      this.date_Provider_Service.updateCartData('report');
    }
  }
  else {
    let indexcredit = this.cartList.findIndex(x => x.id === id);
    if (indexcredit > -1) {
      this.cartList.splice(indexcredit, 1);
      this.itemCount = this.cartList.length;
      console.log("item count in second else block" + this.itemCount)
      this.calculateItemSum();
      this.removeItemFromDB(id);
      this.date_Provider_Service.updateCartData('report');
    }
  }
  
  setTimeout(() => {
    this.loadCartData();
  }, 1000); 
  
  this.date_Provider_Service.setViewCartDetailData(this.cartList);
}

async removeItemFromDB(id) {
  const request = {
    "delete_ids": [id]
  };
  this.cart_service.deleteReportFromCart(request).pipe(takeUntil(this.isActive)).subscribe((res: any) => {
    if (!res.isError) {
      this.shared_service.stopLoading();
    }
  }, (err) => {

    this.shared_service.stopLoading();
    this.alert_service.error('Error while deletiing items.');
  });

}

}
