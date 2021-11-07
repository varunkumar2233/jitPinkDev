import { Component, OnInit } from '@angular/core';
import { DataProviderService } from '../services/data-provider.service';
import { takeUntil } from 'rxjs/operators';
import { Subscription, Subject } from 'rxjs';
import { addToCartServie } from '../services/add-to-cart.service';
import { AlertServiceService } from '../../shared/services/alert-service.service';
import { SharedService } from '../../shared/services/shared-service.service';

@Component({
  selector: 'app-sample-reportcart',
  templateUrl: './sample-reportcart.component.html',
  styleUrls: ['./sample-reportcart.component.scss']
})
export class SampleReportCartComponent implements OnInit {
  isActive: Subject<boolean> = new Subject();
  standardReportID : any;
  platiumReportID : any;
  reportsdata:any;
  isStandardClicked: boolean = false;
  isPlatiumClicked: boolean = false;
  constructor(
    private date_Provider_Service: DataProviderService, 
    private cartInfo: addToCartServie,
    private alert_service : AlertServiceService,
    private shared_service : SharedService,
  ) { }

  ngOnInit(): void {
    this.date_Provider_Service.getAvailablesampleReport().pipe(takeUntil(this.isActive)).subscribe((report:any)=>{
      this.reportsdata = report;
      this.initializeFieldsData();
    },
    error => {
      //this.alert_service.error('error');
    });
    //this.loadCartData();
    
  }

    initializeFieldsData()
    {
        this.standardReportID=  this.reportsdata[0].id;
        this.platiumReportID = this.reportsdata[1].id;
    }

    getPlatium(id)
    {
      this.isPlatiumClicked = true;
                  var request = {
                          "id" : id=='S' ? this.standardReportID : this.platiumReportID
                  };

                  if(this.platiumReportID==undefined)
{
  
  this.alert_service.error("Please select address.<a href='./main/getSampleReports'> Select Addres</a>");
  this.isPlatiumClicked = false;
  return false;
}


                  this.cartInfo.addSampleReport(request).pipe(takeUntil(this.isActive)).subscribe(data =>{
                    this.alert_service.success('Free Platinum report added in report list');
                    this.isPlatiumClicked = false;
                  },error => {
                    //this.alert_service.error('error while adding item in cart.');
                    this.isPlatiumClicked = false;
                    this.shared_service.stopLoading();
                  });

    }
   getStandard(id)
    {
            this.isStandardClicked = true;
                        var request = {
                                "id" : id=='S' ? this.standardReportID : this.platiumReportID
                        };
      
                        if(this.standardReportID==undefined)
      {
        
        this.alert_service.error("Please select address.<a href='./main/getSampleReports'> Select Addres</a>");
        this.isStandardClicked = false;
        return false;
      }


                this.cartInfo.addSampleReport(request).pipe(takeUntil(this.isActive)).subscribe(data =>{
                  this.alert_service.success('Free Standard Report added in report list');
                  console.log(data); // getting reportID after addig item to cart.
                  this.isStandardClicked = false;
                },error => {
                  this.isStandardClicked = false;
                  //this.alert_service.error('error while adding item in cart.');
                  this.shared_service.stopLoading();
                });
    }
}
