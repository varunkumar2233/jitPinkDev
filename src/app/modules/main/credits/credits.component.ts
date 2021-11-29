import { Component, OnInit } from '@angular/core';
import { Options } from '@angular-slider/ngx-slider';
import { ShopifyService } from '../services/shopify.service';
import { FormControl, FormGroup } from '@angular/forms';
import { addToCartServie } from '../services/add-to-cart.service';
import { DataProviderService } from '../services/data-provider.service';
import { takeUntil } from 'rxjs/operators';
import { Subscription, Subject } from 'rxjs';
import { SharedService } from '../../shared/services/shared-service.service';
import { AlertServiceService } from '../../shared/services/alert-service.service';
import { TabDirective } from 'ngx-bootstrap/tabs';
import { IfTermsAcceptedService } from '../../home/if-terms-accepted.service';

@Component({
  selector: 'app-credits',
  templateUrl: './credits.component.html',
  styleUrls: ['./credits.component.scss']
})
export class CreditsComponent implements OnInit {
  value?: string;
  onSelect(data: TabDirective): void {
    this.value = data.heading;
    if(this.value == "STANDARD"){
      this.sliderEvent()
    }
    else{
      this.sliderEvent1()
    }
  }
  sliderEvent() {
      if(this.standardValue == 100){
        this.reachusFlag = false;
      }
  
      else {
        this.reachusFlag = true;
      }
    }

    sliderEvent1() {
        if(this.platiumvalue == 100){
          this.reachusFlag = false;
        }
    
        else {
          this.reachusFlag = true;
        }
      }
  
  form = new FormGroup({
    variant: new FormControl([]),
    quantity: new FormControl(1),
  });
  productList: Array<any>;
  constructor(private shopify_service: ShopifyService,
    private ifTermsAccepted:IfTermsAcceptedService,
    private shared_service : SharedService,
    private cartInfo: addToCartServie,
    private alert_service : AlertServiceService,
    private date_Provider_Service: DataProviderService,) { }
  standardValue: number = 1;
  platiumvalue: number=1;
  options: Options = {
    floor: 1,
    ceil: 100,
    showSelectionBarEnd: true
  };
  standardCredit :number;
  platiumCredit :number;
  standardProduct : any;
  platiumProduct : any;
  discount:any;
  reachusFlag: boolean = true;
  standartTotalafterDiscounted: number = 350;
  platiumTotalafterDiscounted: number =1000;
  isActive: Subject<boolean> = new Subject();   // Subject used to take until the component is alive.

  //premiumProduct :any[];
  
  ngOnInit(): void {
    this.ifTermsAccepted.ifTermsAccepted();
      this.getCreditsProduct();
if(this.standardValue == 100) {
  this.reachusFlag = false;
}
    // this.shopifyService.getProductById(this.productInput.id).then((product) => {
    //   this.product = product;
    //   this.form.get("variant").setValue(this.product.variants[0]);
    // }).catch(err => alert(err));
  }
  // get discount(): any {
  //   return (this.standardValue + 10);
  //   }

  getStandardDiscountPerReport()
  {
    if(this.standardValue>=26 && this.standardValue <=49)
    {
      return 250;
    } else if(this.standardValue>=50) {
      return 200;
    } else
    {
      return 350;
    }
  }

  getStandardDiscount()
  {
   
  
   
    //discount = 100 * (original_price - discounted_price) / original_price
    if(this.standardValue>=26 && this.standardValue <=49)
    {
      return Math.round(100 * ((this.standardValue * 350) - (this.standardValue * 250)) / ((this.standardValue * 350)));
    
    } else if(this.standardValue>=50) {
      return Math.round (100 * ((this.standardValue * 350) - (this.standardValue * 200)) / ((this.standardValue * 350)));
    } else
    {
      
      return Math.round(100 * ((this.standardValue * 350) - (this.standardValue * 350)) / ((this.standardValue * 350)));
    }
  }

  getPremiumDiscount()
  {
   
    if(this.platiumvalue>=25 && this.platiumvalue <=49)
    {
      return Math.round(100 * ((this.platiumvalue * 1000) - (this.platiumvalue * 770)) / ((this.platiumvalue * 1000)));
    } else if(this.platiumvalue>=50) {
      return Math.round(100 * ((this.platiumvalue * 1000) - (this.platiumvalue * 615)) / ((this.platiumvalue * 1000)));
      } else
    {
      return Math.round(100 * ((this.platiumvalue * 1000) - (this.platiumvalue * 1000)) / ((this.platiumvalue * 1000)));
    }

  }
  
  
  

  gettotalAfterDiscountStandard()
  {
   
    if(this.standardValue>=25 && this.standardValue <=49)
    {
      this.standartTotalafterDiscounted = this.standardValue * 250;
      return this.standartTotalafterDiscounted;
    
    } else if(this.standardValue>=50) {
      this.standartTotalafterDiscounted = this.standardValue * 200;
      return this.standartTotalafterDiscounted;
   
    } else
    {
      this.standartTotalafterDiscounted = this.standardValue * 350;
      return this.standartTotalafterDiscounted;
    }
  }

  gettotalAfterDiscountplatium()
  {
  
    if(this.platiumvalue>=25 && this.platiumvalue <=49)
    {
      this.platiumTotalafterDiscounted = this.platiumvalue * 770;
      return this.platiumTotalafterDiscounted;
    } else if(this.platiumvalue>=50) {
      this.platiumTotalafterDiscounted = this.platiumvalue * 615;
      return this.platiumTotalafterDiscounted;
      } else
    {
      this.platiumTotalafterDiscounted = this.platiumvalue * 1000;
      return this.platiumTotalafterDiscounted;
    }
  }


  getCreditsProduct()
  {
    this.shopify_service.getProducts().then((x) => {
     this.getCreditData(x);
    }).catch(err => alert(err));
  }

  getCreditData(obj)
  {
    const standardCreditsProduct = obj.find(e => e.handle === `standard-credit`).variants[0].price;;
    const platiumCreditProdusts = obj.find(e => e.handle === `platinum-credit`).variants[0].price;;
   
    //var nietos = [];
    var standardObj = {
     "price": standardCreditsProduct,
     "currency" : "USD"
    };

    var platiumObj = {
      "price": platiumCreditProdusts,
      "currency" : "USD"
    }
    //this.standardProduct = [];
    //this.platiumProduct = [];
    this.standardProduct= standardObj
    this.platiumProduct= platiumObj;
  }
    async addCreditStandard()
    {
      var obj = {  // need to handle condition first.
        "id": 0,
       // "address": 'testing address', // this will change...
        "report_type": 'standard_credits',
        "price": this.standartTotalafterDiscounted,
        "quantity" : this.standardValue
        };
      
        this.date_Provider_Service.addtoCart(obj);
          var standObj = {
            "standard_credits":this.standardValue
          };
          await this.addCreditToCartDB(standObj);
      // this.date_Provider_Service.addtoCart('CS');
    }
    async addCreditPlatium()
    {
   
      var obj = {  // need to handle condition first.
        "id": 0,
        //"address": 'testing address', // this will change...
        "report_type": 'platinum_credits',
        "price": this.platiumTotalafterDiscounted,
        "quantity" : this.platiumvalue
        };
        this.date_Provider_Service.addtoCart(obj);
          var premObj = {
            "platinum_credits": this.platiumvalue
          };
        await this.addCreditToCartDB(premObj);

         // this.date_Provider_Service.addtoCart('CP');
    }

    addCreditToCartDB(reportsdata) {
      this.cartInfo.addCreditToCartDB(reportsdata).pipe(takeUntil(this.isActive)).subscribe(
        data =>{
        console.log(data); // getting reportID after addig item to cart.
      },
      error => {
        this.alert_service.error('error while adding item in cart.');
      });
    }
}
