import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GetCordsService {
  //getcords:any;
  constructor() { }
  getGeoCords(){
    navigator.geolocation.getCurrentPosition(position => {
      var getcords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,

        }
        return getcords;
    })
  }

}
