import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ElementRef, Injectable } from '@angular/core';
import { MapboxServService } from '../services/mapbox-serv.service';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { WelcomePinkertonComponent } from '../welcome-pinkerton/welcome-pinkerton.component';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder } from "@angular/forms";
import { SharedService } from 'src/app/modules/shared/services/shared-service.service';
import { takeUntil } from 'rxjs/operators';
import { Subject, Subscription } from 'rxjs';
import { DataProviderService } from '../services/data-provider.service';
import { ShopifyService } from '../services/shopify.service';
import { AlertServiceService } from '../../shared/services/alert-service.service';
@Component({
  selector: 'app-get-sample-reports',
  templateUrl: './get-sample-reports.component.html',
  styleUrls: ['./get-sample-reports.component.scss']
})
export class GetSampleReportsComponent implements OnInit {
  bsModalRef!: BsModalRef;
  constructor(private map: MapboxServService,
    private router: Router,
    private activevateRoute: ActivatedRoute,
    private modalService: BsModalService,
    private httpRequest: HttpClient,
    private _fb: FormBuilder,
    private sharedService: SharedService,
    private shopify: ShopifyService,
    private reportStore: DataProviderService,
    private alertService: AlertServiceService,) { }
  private isActive = new Subject();
  addressselected!: string;
  countryselected!: string;
  countryCode!: string;
  selectedCountry: any = null;
  selectedAddres: any = null;
  lat = 0;
  lon = 0;
  platinumReportPrice:number;
  standardReportPrice:number;
  countries = null;
  countriesMasterList = null;
  headers = ["Location/Name", "Type", "Date"];
  rows = [
  ]
  bindedTwoWays = 'Something else here';
  myReportListStaging = [];
  filterTerm: string;
  productList: Array<any>;
  selectedAddress: string;
  selectedCountryCode: string;
  selectedPlaceImageURL: string;
  isResponseFromNotification: boolean = false;
  datasubcription: Subscription;
  availableSampleReportData: any;


  ngOnInit(): void {

    var locationData = [];

    //this.shopify.getAuthenticatedCheckoutUrl().then(data => console.log(data))

      //console.log(data[0].variants[0].price);
      //console.log(data[3].handle);


    //this.bindMyReportsData();


  // this.datasubcription =  this.reportStore.getCartNotificationData().subscribe(data=>{
  //     console.log("Subscribed Data for notification")
  //     console.log(data)
  //     if(data.new_report_count>0){
  //       this.isResponseFromNotification = true;
  //     }
  //   });
  }

  ngOnDestroy() {
  //  this.datasubcription.unsubscribe();
  }
  // myreportList(response) {
  //   var TempArray = [];
  //   this.myReportListStaging = [];
  //   response.forEach(function (value) {
  //     TempArray.push(
  //       {
  //         "address": value.address,
  //         "country": value.country,
  //         "timestamp": value.timestamp,
  //         // TODO: download_url can be null if the report failed to generate
  //         "download_url": value.download_url,
  //         "report_type": value.report_type,
  //         "is_archived": value.is_archived,
  //         "lon": value.lon,
  //         "lat": value.lat,
  //         "is_failed": value.is_failed,
  //         "failure_count": value.failure_count,
  //         "is_seen": value.is_seen
  //         //"crimescore_set" :
  //       }
  //     );
  //   });
  //   this.rows = TempArray;
  //   if(!this.isResponseFromNotification){
  //     console.log("this.isResponseFromNotification")
  //     this.rows = this.rows.filter(function( obj ) {
  //       delete obj.is_seen;
  //       return obj;
  //   });

  //   console.log(this.rows)
  //   }
  //   this.myReportListStaging = TempArray;
  //   //console.log(this.rows);
  //   // return TempArray;
  // }




  onReportSearch(val) {

    //this.filterItem = val.toLocaleLowerCase();
    //this.rows = this.myReportListStaging.filter(a => a.address == "ma");
    // return this.rows.filter((product: any) =>
    //   product.address.toLocaleLowerCase().indexOf(this.filterItem) !== -1);
    //this.filterItem = val;
    //alert(val);
    //   if(val!=null){
    //  // var item = this.rows.find(item => item.address === val);
    // }
    // else
    // {
    //   //this.rows=this.myReportListStaging;
    // }
  }
  // bindMyReportsData() {
  //   this.sharedService.startLoading();
  //   this.map.getMyReports().pipe(takeUntil(this.isActive)).subscribe((res: any) => {
  //     console.log("res")
  //     console.log(res)
  //     if (!res.isError) {
  //       this.myreportList(res);
  //       this.sharedService.stopLoading();
  //     }
  //   }, (err) => {
  //     console.log('my report api stach trace below');
  //         console.log(err);
  //     this.sharedService.stopLoading();
  //     this.alertService.error('Error while fetching reports.');
  //   });
  // }


  hideSearch() {
    this.isAnyReportAvaible = false;
  }

  isAnyReportAvaible: boolean = false;
  isBothReportAvaible: boolean = false;
  availableReportData: any;

  ngAfterViewInit(): void {
    this.map.buildMapFree(this.lat, this.lon, 1);
    var locationData = [];
    this.map.getLocationList().pipe(takeUntil(this.isActive)).subscribe(data => {
      this.countries = data;
      this.countries.forEach(value => {
        locationData.push(
          {
           "name": value.address,
           "id": value.id,
           "address": value.address,
           "report_type": value.report_type,
           "lon": value.lon,
           "lat": value.lat,
           "country": value.country
          }
        );
      });
      this.countriesMasterList= locationData;
      const uniqueCountry = [...new Map(locationData.map(item =>
        [item['address'], item])).values()];

      this.countries = uniqueCountry;
      //this.onCountrySelection('');
      console.log(',.,.................................locations data');
      console.log(this.countries);
      this.map.addLocationMarkersSample(this.countries)

      // load my locations to show on map
      // this.map.getMyReports().pipe(takeUntil(this.isActive)).subscribe((res: any) => {
      //   console.log("res")
      //   console.log(res)
      //   this.map.addLocationMarkers(res)
      // })
    });

    // when location is selected in mapbox, check report availability
    // this.map.geocoder.on('result', async res => {
    //   console.log(res)
    //   const [lon, lat] = res.result.center
    //   const resContext = res.result.context
    //   const iso2 = resContext[resContext.length - 1].short_code
    //   const iso3 = this.countries.find(e => e.iso2 === iso2).iso3
    //   //this.selectedAddress = res.result.
    //   this.selectedAddress = res.result.place_name;
    //   this.selectedCountryCode= iso3;
    //   // console.log("iso3")
    //   // console.log(iso3)
    //   // get image-start
    //   this.selectedPlaceImageURL = "https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/["+res.result.bbox+"]/100x100?padding=5,1,20&access_token="+environment.mapbox.accessToken+""
    //   console.log(this.selectedPlaceImageURL)
    //   // get image- end
    //   try {
    //     const data: any = await this.map.getAvailability(iso3, lon, lat).toPromise()

    //     this.availableReportData = data;

    //     if (data.standard || data.platinum) {
    //       if (data.standard && data.platinum) {
    //         this.isBothReportAvaible = true;
    //       }
    //       this.isAnyReportAvaible = true;
    //       console.log(this.isAnyReportAvaible)
    //       // TODO: show report options to user
    //       this.map.map.flyTo({
    //         center: res.result.center,
    //         zoom: 10
    //       })
    //     }
    //     else {
    //       alert('Reports are not available for this location.')
    //     }
    //   }
    //   catch (e) {
    //     alert('Reports are not available for this location.')
    //   }
    // })


  }



  // onExploreReports() {
  //   console.log("explore clicked")

  //   this.availableReportData['platinumReportPrice'] =  this.platinumReportPrice;
  //   this.availableReportData['standardReportPrice'] =  this.standardReportPrice;

  //   this.availableReportData['selectedAddress'] =  this.selectedAddress;
  //   this.availableReportData['selectedCountryCode'] =  this.selectedCountryCode;

  //   this.availableReportData['selectedPlaceImageURL'] =  this.selectedPlaceImageURL;

  //   this.reportStore.storeAvailableReport(this.availableReportData);
  //   this.router.navigate(['purchaseReports'], { relativeTo: this.activevateRoute });

  //   console.log(this.availableReportData)
  // }


  onExploreReports() {
    console.log("explore clicked");
    debugger;

    this.getReportsIDs();

    //this.reportStore.storeAvailableReport(this.availableReportData);
    this.router.navigate(['../sampleReports'], { relativeTo: this.activevateRoute });
    //console.log(this.availableReportData)
  }

  getReportsIDs()
  {
    debugger;
    var TempArray = [];
    var address= this.selectedAddres;
    //var ch ='Anfield Stadium, Liverpool, England';
    var __FOUND = this.countriesMasterList.find(function(key, index) {
      if(key.address == address)
      {
        TempArray.push(key);
      }
    });
    this.availableSampleReportData= TempArray;
    this.reportStore.storeAvailablesampleReport(this.availableSampleReportData);
    console.log(TempArray);
  }



  onLocationSelected(loc) {
    debugger;
    const { lon, lat } = loc
    this.isBothReportAvaible = true;
    this.selectedAddres = loc.address;
    this.selectedCountryCode= loc.country;
    //this.selectedCountry= loc.name;
    this.isAnyReportAvaible = true;
    this.map.map.flyTo({
      center: [lon, lat],
      zoom: 10
    })
    this.map.showFoundReportMarker(lon, lat)
  }

}
