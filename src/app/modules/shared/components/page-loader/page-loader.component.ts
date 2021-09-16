import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { SharedService } from '../../services/shared-service.service';
import { debounceTime } from 'rxjs/operators';
@Component({
  selector: 'app-page-loader',
  templateUrl: './page-loader.component.html',
  styleUrls: ['./page-loader.component.css']
})
export class PageLoaderComponent implements  OnInit, OnDestroy {
  loading: boolean = false;
  loadingSubscription: Subscription;

  constructor(private sharedService: SharedService) {
  }

  ngOnInit() {
    this.loadingSubscription = this.sharedService.loadingStatus.pipe(
      debounceTime(200)
    ).subscribe((value) => {
      this.loading = value;
    });
  }

  ngOnDestroy() {
    this.loadingSubscription.unsubscribe();
  }
}
