import { ThisReceiver } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { AlertServiceService } from '../../shared/services/alert-service.service';
import { SharedService } from '../../shared/services/shared-service.service';
import { addToCartServie } from '../services/add-to-cart.service';
import { DataProviderService } from '../services/data-provider.service';
import { ShopifyService } from '../services/shopify.service';
import { Subscription, Subject } from 'rxjs';
import { FormGroup,FormBuilder} from '@angular/forms';
import { Router } from '@angular/router';
import { UserRegService } from '../../shared/services/user-reg.service';

@Component({
  selector: 'app-purchase-reports',
  templateUrl: './purchase-reports.component.html',
  styleUrls: ['./purchase-reports.component.scss']
})
export class PurchaseReportsComponent implements OnInit {
  reportsdata:any;
  cartData : any = {};
  standartReportAmount : any;
  platiumReportAmount : any;
  standardbuttondisabled : boolean = false;
  platiumbuttondisabled : boolean = false;
  address : any;
  lat:any;
  lon:any;
  geo:any;
  countryCode : any;
  PurchaceReport: FormGroup;
  isSignUpClicked: boolean = false;
  disableButton: boolean = false;
  showSpanError: boolean = false;
  AvailableCredits : any;
  isUpdateCreditBalance: boolean;
  ifUpdateCreditButtonClicked : boolean;
  afterReportDownload : boolean;
  
  isActive: Subject<boolean> = new Subject();   // Subject used to take until the component is alive.
  constructor(private cart_service : addToCartServie,
    private router: Router,
    private formBuilder: FormBuilder,
    private shared_service : SharedService,
    private alert_service : AlertServiceService,
    private date_Provider_Service: DataProviderService, 
    private shopify_Service: ShopifyService,
    private cartInfo: addToCartServie,
    private UserRegService: UserRegService,) {
      this.date_Provider_Service.getUpdatedData().pipe(takeUntil(this.isActive)).subscribe((data:any)=>{
        this.loadCartData(); 
      });
      this.date_Provider_Service.getcartData().pipe(takeUntil(this.isActive)).subscribe((data:any)=>{ 
        this.loadCartData(); 
      });
     }

  addReporttoCartDB(reportsdata,amount) {
    this.cartInfo.addReporttoCart(reportsdata).pipe(takeUntil(this.isActive)).subscribe(data =>{
      data['price']=amount;
      data['quantity']=0;
      this.date_Provider_Service.addtoCart(data);
      //this.alert_service.success('Item added in Cart');
      //this.router.navigate(['/main/cart'])

      console.log(data); // getting reportID after addig item to cart.
      
    },error => {
      this.alert_service.error('error while adding item in cart.');
      this.shared_service.stopLoading();
    });
  }
  ngOnInit(): void {
    
    //this.getReportPricesfromShopify();
    //this.addOrCreateCart(this.reportsdata);
  }


initializeFieldsData()
{
  this.address = this.reportsdata.selectedAddress;
  this.lat= this.reportsdata.lat;
  this.lon= this.reportsdata.lon,
  this.geo = this.reportsdata.geo_id,
  this.standartReportAmount= this.reportsdata.standardReportPrice,
  this.platiumReportAmount= this.reportsdata.platinumReportPrice,
  this.countryCode= this.reportsdata.selectedCountryCode
}

  loadCartData() // lazy load.
  {
    this.disableButton = false;
    this.cart_service.displayCartData().pipe(takeUntil(this.isActive)).subscribe(data =>{
    this.cartData=data;
    if(this.reportsdata){
      var duplicateValueTrue = this.cartData.reports.filter(DuplicateRecord => DuplicateRecord.geo_id == this.reportsdata.geo_id)
    if(duplicateValueTrue.length != 0){
      this.disableButton = true;
    } 
    } 
    if(this.isSignUpClicked == true)
    {
      console.log("isSignUpClieck button loadcart date first time" +  " " +this.isSignUpClicked);
      this.showSpanError == true;
      console.log("showSpanError button loadcart date first time" +  " " +this.showSpanError);
    }
    this.standardbuttondisabled = false; 
    this.shared_service.stopLoading();
    this.isSignUpClicked = false;
    console.log("isSignUpClieck button loadcart date after stopLoading" +  " " +this.isSignUpClicked);
    },
    error => {
      this.shared_service.stopLoading();
      this.alert_service.error('error while get cart data');
      this.standardbuttondisabled = false; 
      this.isSignUpClicked = false;
    });
    //this.isSignUpClicked = false;
  }

  ngAfterViewInit(): void {
    this.date_Provider_Service.getAvailableReport().subscribe((report:any)=>{
      this.reportsdata = report;
      console.log("report")
      console.log(report)
      this.initializeFieldsData(); 
    },
    error => {
      this.alert_service.error('error');
    });
    if(this.reportsdata)
    {
      localStorage.setItem('reportsdata',JSON.stringify(this.reportsdata));
    }
    if(!this.reportsdata){
      this.reportsdata= JSON.parse(localStorage.getItem('reportsdata'));
      this.initializeFieldsData();
    }
    this.getCreditBalances(false);
    this.loadCartData();

  }
  addToCartStandard() //Add to cart buttin click
  {
    this.showSpanError = true;
   // this.disableButton = true;
    this.isSignUpClicked = true;
    //this.shared_service.startLoading();
   // this.standardbuttondisabled = true;
    //setTimeout(function(){ this.standardbuttondisabled = false; }, 1000);
   // this.shared_service.startLoading();
    if(this.address == null || undefined) // condition if address not selected from map.
    {
      this.alert_service.error("Please select address for purchase.<a href='./main'> Select Addres</a>");
      this.isSignUpClicked = false;
      this.shared_service.stopLoading();
     // this.standardbuttondisabled = false;
      return false;
      //return false;
    }

          var obj = {  // need to handle condition first.
                  "address": this.address, // this will change...
                  "report_type": 'standard',
                  "country": this.countryCode,//this.countryCode,
                  "lon": this.lon,
                  "lat": this.lat,
                  "geo_id": this.geo,
                  "price": this.standartReportAmount, 
    };

    // let isReportAlreadyExists = this.cartData.reports.find(acc=>{ //found_user is always undefined
//   return acc.report_type == 'standard';
// });

// alert(isReportAlreadyExists);
// if(isReportAlreadyExists!=null)
// {
//   this.alert_service.error('Report already added in Cart.');
//   //this.standardbuttondisabled = false; 
//   this.shared_service.stopLoading();
//   //this.shared_service.stopLoading();
// }
// else
// {
// }

this.addReporttoCartDB(obj,this.standartReportAmount); // transactionDB Add and display in cart UI.
this.loadCartData();
//this.isSignUpClicked = false;
//this.shared_service.stopLoading();
}

   //addToCartPremium() //Add to cart buttin click
  // {
  //   this.isSignUpClicked = true;
  //   //this.shared_service.startLoading();
  //   if(this.address == null || undefined) // condition if address not selected from map.
  //   {
  //     this.alert_service.error("Please select address for purchase.<a href='./main'> Select Addres</a>");

  //     this.isSignUpClicked = false;
  //     return false;
  //   }
  // var obj = {  // need to handle condition first.
  // "address": this.address, // this will change...
  // "report_type": 'platinum',
  // "country": this.countryCode,
  // "lon": this.lon,
  // "lat": this.lat,
  // "geo_id": this.geo,
  // "price": this.platiumReportAmount,
  // };

  // // let isReportAlreadyExists = this.cartData.reports.find(acc=>{ //found_user is always undefined
  // //   return acc.report_type == 'platinum';
  // // });

  // // //let isReportAlreadyExists = this.cartData.reports.find(x => x.report_type === 'platinum')[0];
  // // if(isReportAlreadyExists!=null)
  // // {
  // //   this.alert_service.error('Report already added in Cart.');
  // // }
  // // else
  // // {
    
  // // }
  // this.addReporttoCartDB(obj,this.platiumReportAmount);
  // this.loadCartData();
  
  // }
  
  // async getReportPricesfromShopify()
  // {
  //   this.shopify_Service.getProducts().then(data => {
  //     this.standartReportAmount = data.find(e => e.handle === `standard-report`).variants[0].price;
  //     this.platiumReportAmount = data.find(e => e.handle === `platinum-report`).variants[0].price;
  //   });
  // }

  getCreditBalances(ifUpdateCreditCall : boolean){
    this.shared_service.startLoading();
    this.ifUpdateCreditButtonClicked = false;
    this.UserRegService.getReportCreditBalance()
      .pipe(takeUntil(this.isActive))
      .subscribe((res: any) => {
        if (res) {
          this.AvailableCredits = res.standard.available;
          if(this.AvailableCredits == 0)
          {
              if(ifUpdateCreditCall == true)
              {
                this.router.navigateByUrl('/main');
                setTimeout(()=>{
                  this.alert_service.error("No more credits balance available. Please add the report to cart");
                },3000);
              }
          }
          this.shared_service.stopLoading()
        }
        else {
          this.shared_service.stopLoading()
          this.alert_service.error("Credit balance details not found.");
        }
      });
  }

  updateCreditBalance(updateCreditCall : boolean){
    this.ifUpdateCreditButtonClicked = true;
    if(this.address == null || undefined)
    {
      this.ifUpdateCreditButtonClicked = false;
      this.alert_service.error("Please select address for purchase.<a href='./main'> Select Addres</a>");
      this.shared_service.stopLoading();
      return false;
    }

    var creditBalanceUpdateRequest = {  
      "address": this.address, 
      "report_type": 'standard',
      "country": this.countryCode,
      "lon": this.lon,
      "lat": this.lat,
      "geo_id": this.geo
};

    this.UserRegService.updateCreditBalance(creditBalanceUpdateRequest).pipe(takeUntil(this.isActive)).subscribe((res: any) => {
      if (res) {     
         this.ifUpdateCreditButtonClicked = false;
         this.getCreditBalances(updateCreditCall);
         this.router.navigateByUrl('/main');
         this.alert_service.success("One credit has been redeemed. You can now view your report.");
      }
      else {
        this.ifUpdateCreditButtonClicked = false;
        this.alert_service.error("Error occured in buying report, please try again");
      }
    });
  }
}
