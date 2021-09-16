import { Component, OnInit } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-map-on-home',
  templateUrl: './map-on-home.component.html',
  styleUrls: ['./map-on-home.component.scss']
})
export class MapOnHomeComponent implements OnInit {

  map?: mapboxgl.Map;
  style = 'mapbox://styles/pinkertonadmin/ckrdl5ku616tq17mtdhgdqjff/';
  lat = 42.281712;
  lng = -83.748909;
  zoom = 1
  constructor() {
    (mapboxgl as any).accessToken = environment.mapbox.accessToken;
  }
  buildMap() {
    
    this.map = new mapboxgl.Map({
      container: 'map',
      style: this.style,
      zoom: this.zoom,
      center: [this.lng, this.lat]
    })

    var nav = new mapboxgl.NavigationControl();
    this.map.addControl(nav, 'top-left');
    this.map.on('load', function (e) {
      this.addLayer(
        {
          id: 'country-boundaries',
          source: {
            type: 'vector',
            url: 'mapbox://mapbox.country-boundaries-v1',
          },
          'source-layer': 'country_boundaries',
          type: 'fill',
          paint: {
            'fill-color': '#dc3a25',
            'fill-opacity': 0.4,
          },
        },
        'country-label'
      );
      this.setFilter('country-boundaries', [
        "in",
        "iso_3166_1_alpha_3",
        'GBR',
        'USA',
        'MEX'
      ]);
    });

    
    // Set options ,marker
// var marker = new mapboxgl.Marker({
//         color: "#FFFFFF",
//         draggable: true
//       }).setLngLat([30.5, 50.5])
//       .addTo(this.map);

    this.map.addControl(new mapboxgl.GeolocateControl({
      positionOptions: {
          enableHighAccuracy: true
      },
      trackUserLocation: true
  }));
  }
  ngOnInit(): void {
    this.buildMap()
  }

}
