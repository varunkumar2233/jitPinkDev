import { ElementRef, Injectable, SecurityContext } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { GetCordsService } from './get-cords.service';

import { HttpClient } from '@angular/common/http';

import MapboxGeocoder from '@mapbox/mapbox-gl-geocoder';
import { environment } from '../../../../environments/environment';
import download from 'downloadjs'
import { SharedService } from '../../shared/services/shared-service.service';

import { scaleLinear, rgb } from 'd3'
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})

export class MapboxServService {

  geocoder: any;

  map?: mapboxgl.Map;
  style = 'mapbox://styles/pinkertonadmin/ckrdl5ku616tq17mtdhgdqjff/';

  markers: Array<mapboxgl.Marker>
  foundLocationMarker: mapboxgl.Marker;

  zoom = 12;
  apiUrl: any;
  constructor(private geocord: GetCordsService, private httpRequest: HttpClient,
    private shared_service: SharedService, private sanitize: DomSanitizer) {
    (mapboxgl as any).accessToken = environment.mapbox.accessToken;
    this.apiUrl = environment.apiUrl;
  }
  buildMap(longval: any, latval: any, zoomval: number, geocoderContainer: ElementRef<HTMLDivElement>) {
    this.map = new mapboxgl.Map({
      container: 'map',
      style: this.style,
      zoom: zoomval,
      center: [longval, latval]
    });
    this.map.addControl(new mapboxgl.NavigationControl());


    this.geocoder = new MapboxGeocoder({
      accessToken: mapboxgl.accessToken,
      mapboxgl: mapboxgl,
    });
    this.geocoder.addTo(geocoderContainer.nativeElement)
  }
  buildMapFree(longval: any, latval: any, zoomval: number) {
    this.map = new mapboxgl.Map({
      container: 'mapFree',
      style: this.style,
      zoom: zoomval,
      center: [longval, latval]
    });
    this.map.addControl(new mapboxgl.NavigationControl());
  }

  getCountryList() {
    return this.httpRequest.get(`${environment.getCountryList}`);
  }


  getLocationList() {
    return this.httpRequest.get(`${environment.getLocationList}`);
  }

  getMyReports() {
    return this.httpRequest.get(`${environment.getMyReports}`);
  }

  getDocumentSasUrlByUrl(id) {
    return this.httpRequest.get(`${environment.apiUrl}report/download/` + id + '/' + `${environment.securekey}`);
  }
  getAvailability(iso3, lon, lat) {
    return this.httpRequest.get(
      `${environment.apiUrl}report/availability/${iso3}/` + `${environment.securekey}`,
      { params: { lon, lat } }
    )
  }

  getPurchaseHistory() {
    return this.httpRequest.get(`${environment.getPurchaceHistory}`);
  }


  async downloadReportCSV() {
    const res = await this.httpRequest.get(`${environment.apiUrl}report/csv/` + `${environment.securekey}`, {
      responseType: 'arraybuffer'
    }).toPromise()

    //this.shared_service.startLoading();
    download(new Blob([res]), 'PCI Report Summary.csv', 'text/csv')
    this.shared_service.stopLoading();

  }

  addLocationMarkers(locations) {
    // sort by latitude so that the pin points dont appear on the top of the colored pin tops
    this.markers = locations
      .sort((a, b) => b.lat - a.lat)
      .map(e => this.createLocationMarker(e))
  }

  addLocationMarkersSample(locations) {
    // sort by latitude so that the pin points dont appear on the top of the colored pin tops
    this.markers = locations
      .sort((a, b) => b.lat - a.lat)
      .map(e => this.createLocationMarkerSample(e))
  }
  
  createLocationMarker(location) {
    let totalCrimeIndex
    try {
      // this might throw an undefined error if the report is missing crime scores
      // this shouldn't happen, but can with old reports
      totalCrimeIndex = location.crimescore_set.find(e => e.crime_type === 'total').crime_index
    }
    catch (e) {
      // return dummy marker
      console.error(`Missing total crime score for location ${location.address}`)
      console.error(e)
      return new mapboxgl.Marker()
    }

    const html = `
    <div>
      <h6>${this.sanitize.sanitize(SecurityContext.HTML, location.address)}</h6>

      <p>Total Crime Index:
        <span style="color: ${this.getRiskColor(totalCrimeIndex, false)};">
          ${totalCrimeIndex}x
        </span>
      </p>
      <p>
      <a target = "_blank" href="${location.direct_download_url}"> <img src="assets/images/icon-view-active-light.svg"></a>
      </p>
    </div>
    `
    const popup = new mapboxgl.Popup({
      offset: [0, -40]
    })
      .setHTML(html)

    return new mapboxgl.Marker({
      element: this.createMarkerElementForLocation(location),
      offset: [0, -25]
    })
      .setLngLat([location.lon, location.lat])
      .setPopup(popup)
      .addTo(this.map)
  }
  createLocationMarkerSample(location) {
    const html = `
    <div>
      <h6>${this.sanitize.sanitize(SecurityContext.HTML, location.address)}</h6>
    </div>
    `
    const popup = new mapboxgl.Popup({
      offset: [0, -40]
    })
      .setHTML(html)

    return new mapboxgl.Marker({
      element: this.createMarkerElementForLocationSample(location),
      offset: [0, -25]
    })
      .setLngLat([location.lon, location.lat])
      .setPopup(popup)
      .addTo(this.map)
  }

  createMarkerElement(fillColor) {
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="64" height="48" viewBox="0 0 640 480" xml:space="preserve">
      <desc>Created with Fabric.js 3.6.3</desc>
      <defs>
      </defs>
      <g transform="matrix(1.61 0 0 1.39 322.83 284.38)"  >
      <line style="stroke: rgb(0,0,0); stroke-width: 11; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: rgb(0,0,0); fill-rule: nonzero; opacity: 1;"  x1="0" y1="-99.36422897602537" x2="0" y2="99.36422897602537" />
      </g>
      <g transform="matrix(2.07 0 0 2.06 322.82 91.74)"  >
      <circle style="stroke: ${fillColor}; stroke-width: 8; stroke-dasharray: none; stroke-linecap: butt; stroke-dashoffset: 0; stroke-linejoin: miter; stroke-miterlimit: 4; fill: ${fillColor}; fill-rule: nonzero; opacity: 1;"  cx="0" cy="0" r="40" />
      </g>
      </svg>
    `
    return new DOMParser().parseFromString(svg, 'image/svg+xml').documentElement
  }

  // create a marker element colored for the location
  createMarkerElementForLocation(location) {
    // get fill color based on crime index, default to kate blue
    const totalCrimeIndex = location.crimescore_set.find(e => e.crime_type === 'total')
    const fillColor = totalCrimeIndex ? this.getRiskColor(totalCrimeIndex.crime_index, false) : '#ADCBFA'
    return this.createMarkerElement(fillColor)
  }
  createMarkerElementForLocationSample(location) {
    // get fill color based on crime index, default to kate blue
    
    return this.createMarkerElement('#ADCBFA')
  }
  // create a pinkerton blue marker element
  createBlueMarkerElement() {
    return this.createMarkerElement('#05206A')
  }

  showFoundReportMarker(lon, lat) {
    if (this.foundLocationMarker) {
      this.foundLocationMarker.remove()
    }
    this.foundLocationMarker = new mapboxgl.Marker({
      element: this.createBlueMarkerElement(),
      offset: [0, -25]
    })
      .setLngLat({ lon, lat })
      .addTo(this.map)
  }

  getRiskColor(val, pureRed) {
    if (pureRed && val > 3) return 'red'
    const cutoffs = [
      {'color': '#59AD24', 'start': 0},
      {'color': '#CBD12F', 'start': 1},
      {'color': '#F3E439', 'start': 2},
      {'color': '#E2A93D', 'start': 3},
      {'color': '#C7320E', 'start': 5},
      {'color': '#881111', 'start': 10},
    ]

    // find min/max color, bins
    let min_color, max_color, bin_min, bin_max
    for (let i = 0; i < cutoffs.length; i++) {
      // reached end of cutoffs, return max val
      if (i === cutoffs.length - 1) {
        break
      }

      min_color = cutoffs[i].color
      max_color = cutoffs[i + 1].color
      bin_min = cutoffs[i].start
      bin_max = cutoffs[i + 1].start

      if (val >= cutoffs[i].start && val < cutoffs[i + 1].start) {
        break
      }
    }

    var colorScale = scaleLinear().domain([bin_min, bin_max])
      .range([rgb(min_color), rgb(max_color)]);
    return colorScale(val);
  }

  removeMarkers() {
    this.markers.forEach(e => e.remove())
    this.markers = []
  }

  getReportCreditPurchaseHistory() {
    return this.httpRequest.get(`${environment.getReportCreditPurchaseHistory}`);
  }
}