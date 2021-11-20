import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

 // counter = "0";
   private subject = new ReplaySubject<any>();

  constructor(private http: HttpClient) { }

  getNotificationList() {
    return this.http.get(environment.notificationListUrl);
  }


 notificationListUrl = this.subject.asObservable();

 updateNotification(){
  this.subject.next(true);
}
 
}
