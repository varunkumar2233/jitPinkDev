import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})

export class EcommerceService {

  public DescriptionObj: any;
  public BuildQuotePrePopulateData: any;

  constructor(private http: HttpClient) { }
  
}