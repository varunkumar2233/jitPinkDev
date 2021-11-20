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
import { ColumnMode, SelectionType, SortType } from '@swimlane/ngx-datatable';

@Component({
  selector: '.mapHOmepage',
  templateUrl: './map-home.component.html',
  styleUrls: ['./map-home.component.scss']
})
export class MapHomeComponent implements OnInit, OnDestroy {
  @ViewChild('geocoderContainer') geocoderContainer: ElementRef<HTMLDivElement>;
  bsModalRef!: BsModalRef;
  crimeIndex: number = 0;
  empList = [];
  crimeScore: number = 0;

  loadingIndicator = true;
  reorderable = true;
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;

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
  ViewIcon: boolean;
  countryselected!: string;
  countryCode!: string;
  selectedCountry: any = null;
  lat = 0;
  lon = 0;
  standardReportPrice: number = 0;
  countries = null;
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

  selected = [];

  onSelect({ selected }) {
    this.crimeScore = 0;
    setTimeout(() => {
      this.crimeScore = selected[0].crimeIndex;
    }, 50);
  }
  getRowClass(row: any) {
    return {
      'highlightTR': row.is_seen == false
    };
  }

  ngOnInit(): void {

    //console.log("number of reports:" + this.rows.length)
    //this.shopify.getAuthenticatedCheckoutUrl().then(data => console.log(data))
    //console.log('get all products data');

    //console.log('checkout url.......');
    //this.shopify.getAuthenticatedCheckoutUrl().then(data => console.log(data));
    //this.map.downloadReportCSV();
    this.map.getCountryList().pipe(takeUntil(this.isActive)).subscribe(data => {
      this.countries = data;


      //do not delete this line below
      // this.bsModalRef = this.modalService.show(WelcomePinkertonComponent, Object.assign({}, { class: 'welcome-popup' }));
      // this.bsModalRef.content.closeBtnName = 'Close';
    });
    //this.shopify.getAuthenticatedCheckoutUrl().then(data => console.log(data))



    this.bindMyReportsData();


    this.datasubcription = this.reportStore.getCartNotificationData().subscribe(data => {
      console.log("Subscribed Data for notification")
      console.log(data)
      if (data.new_report_count > 0) {
        this.isResponseFromNotification = true;
      }
    });
  }

  ngOnDestroy() {
    this.datasubcription.unsubscribe();
  }
  myreportList(response) {
    if (response.length == 0) {
      this.myReportListStaging = [];
    } else {
      var TempArray = [];
      this.myReportListStaging = [];
      response.forEach(function (value) {
        TempArray.push(value);
      })

      this.rows = TempArray;
      if (!this.isResponseFromNotification) {
        console.log("this.isResponseFromNotification")
        this.rows = this.rows.filter(function (obj) {
          delete obj.is_seen;
          return obj;
        });

      }
      if (this.rows) {
        for (var i in this.rows) {
          for (var x in this.rows[i].crimescore_set) {
            if (this.rows[i].crimescore_set[x].crime_type == 'total') {
              this.rows[i]['crimeIndex'] = this.rows[i].crimescore_set[x].crime_index;
              console.log(this.rows['crimeIndex']);
            }
          }
        }
      }
      this.myReportListStaging = TempArray;
    }
    this.map.addLocationMarkers(this.myReportListStaging)
  }



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
  bindMyReportsData(countryCode?: string) {
    this.sharedService.startLoading();
    this.map.getMyReports().pipe(takeUntil(this.isActive)).subscribe((res: any) => {
      console.log("res")
      console.log(res)
      if (countryCode != null) {
        res = res.filter(countryFilter => countryFilter.country == countryCode);
      }
      if (!res.isError) {
        this.myreportList(res);
        this.sharedService.stopLoading();
      }
    }, (err) => {
      console.log('my report api stach trace below');
      console.log(err);
      this.sharedService.stopLoading();
      this.alertService.error('Error while fetching reports.');
    });
  }

  getScore(crimeIndex) {
    this.crimeScore = 0;
    setTimeout(() => {
      this.crimeScore = crimeIndex;
    }, 50);

  }

  hideSearch() {
    this.isAnyReportAvaible = false;
  }

  isAnyReportAvaible: boolean = false;
  isBothReportAvaible: boolean = false;
  availableReportData: any;

  ngAfterViewInit(): void {
    this.map.buildMap(this.lat, this.lon, 1, this.geocoderContainer);

    this.map.getCountryList().pipe(takeUntil(this.isActive)).subscribe((data: any) => {
      this.countries = data;
      //this.countries.push({name:"Select All", iso2:"", iso3:""});
      // autoselect usa
      const usa = data.find(e => e.iso3 === 'usa')
      // this.onCountrySelection(usa)
      // allow search in all available countries
      this.map.geocoder.setCountries(this.countries.map(e => e.iso2).join(','))
      //do not delete this line below
      // this.bsModalRef = this.modalService.show(WelcomePinkertonComponent, Object.assign({}, { class: 'welcome-popup' }));
      // this.bsModalRef.content.closeBtnName = 'Close';
      this.countries.push({ name: "Select All", iso2: "", iso3: null });
    });


    // when location is selected in mapbox, check report availability
    this.map.geocoder.on('result', async res => {
      console.log(res)
      const [lon, lat] = res.result.center
      const resContext = res.result.context
      const iso2 = resContext[resContext.length - 1].short_code
      const iso3 = this.countries.find(e => e.iso2 === iso2).iso3
      //this.selectedAddress = res.result.
      this.selectedAddress = res.result.place_name;
      this.selectedCountryCode = iso3;
      // console.log("iso3")
      // console.log(iso3)
      // get image-start
      this.selectedPlaceImageURL = "https://api.mapbox.com/styles/v1/mapbox/streets-v11/static/[" + res.result.bbox + "]/100x100?padding=5,1,20&access_token=" + environment.mapbox.accessToken + ""
      console.log(this.selectedPlaceImageURL)



      // get image- end
      try {
        const data: any = await this.map.getAvailability(iso3, lon, lat).toPromise()

        this.availableReportData = data;

        if (data.standard || data.platinum) {
          if (data.standard && data.platinum) {
            this.isBothReportAvaible = true;
          }
          this.isAnyReportAvaible = true;
          console.log(this.isAnyReportAvaible)
          // TODO: show report options to user
          this.map.map.flyTo({
            center: res.result.center,
            zoom: 15.5
          })
          this.shopify.getProducts().then(data => {

            console.log("data")
            console.log(data)
            //JSON.stringify(data)
            if (data[0].handle == "standard-report") {
              this.standardReportPrice = Number(data[0].variants[0].price);
            } else if (data[1].handle == "standard-report") {
              this.standardReportPrice = Number(data[1].variants[0].price);
            }
            else if (data[2].handle == "standard-report") {
              this.standardReportPrice = Number(data[2].variants[0].price);
            }
            else if (data[3].handle == "standard-report") {
              this.standardReportPrice = Number(data[3].variants[0].price);
            }
          })
          this.map.showFoundReportMarker(lon, lat)
        }
        else {
          this.alertService.error('Reports are not available for this location.')
        }
      }
      catch (e) {
        this.alertService.error('Reports are not available for this location.')
      }
    })
  }

  onCountrySelection = (item: any) => {
    if (item.name == "Select All") {
      this.bindMyReportsData(item.iso3);
      this.selectedCountry = item;
    } else {
      this.selectedCountry = item;
      this.map.map.fitBounds(item.bbox)
      this.map.geocoder.setCountries(this.selectedCountry.iso2);
      this.bindMyReportsData(this.selectedCountry.iso3);
    }
  }

  onExploreReports() {

    console.log("explore clicked")

    this.availableReportData['standardReportPrice'] = this.standardReportPrice;

    this.availableReportData['selectedAddress'] = this.selectedAddress;
    this.availableReportData['selectedCountryCode'] = this.selectedCountryCode;

    this.availableReportData['selectedPlaceImageURL'] = this.selectedPlaceImageURL;

    this.reportStore.storeAvailableReport(this.availableReportData);
    this.router.navigate(['purchaseReports'], { relativeTo: this.activevateRoute });

    console.log(this.availableReportData)
  }

  fileDownloadViaSasUrl(req, ViewIcon) {

    var myRegexp = /(\d+)\D*$/g;
    var match = myRegexp.exec(req);
    this.sharedService.startLoading();
    this.map.getDocumentSasUrlByUrl(match[1]).pipe(takeUntil(this.isActive)).subscribe((res: any) => {
      if (res.url) {
        if (ViewIcon) {
          window.open(res.url, '_blank');
        }
        else {
          this.sharedService.startLoading();
          this.alertService.success("Your report started downloading");
          //Create XMLHTTP Request.
          var req = new XMLHttpRequest();
          req.open("GET", res.url, true);
          req.responseType = "blob";
          req.onload = function () {
            //Convert the Byte Data to BLOB object.
            var blob = new Blob([req.response], { type: "application/pdf" });
            //Check the Browser type and download the File.
            var url = window.URL || window.webkitURL;
            var link = url.createObjectURL(blob);
            var a = document.createElement("a");
            a.setAttribute("download", res.filename);
            a.setAttribute("href", link);
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
          }
          req.send();
        }
      }
      this.sharedService.stopLoading();
    }, (err) => {
      this.alertService.error('Error while downloading report.');
      this.sharedService.stopLoading();
    });
  }

  downloadexl() {

    this.sharedService.startLoading();
    this.map.downloadReportCSV();
    //this.sharedService.stopLoading();
  }
  // onLocationSelected(res) {
  //   const [lon, lat] = res.result.center
  //   this.httpRequest.get(`${environment.apiUrl}report/availability/${this.selectedCountry.iso3}/`, {
  //     params: { lon, lat }
  //   })
  //     .subscribe((data : any) => {
  //       if (data.standard || data.platinum) {
  //         // TODO: show report options to user
  //         this.map.map.flyTo({
  //           center: res.result.center,
  //           zoom: 10
  //         })
  //       }
  //       else {
  //         console.error('Reports are not available for this location.')
  //       }
  //     })
  // }

}
