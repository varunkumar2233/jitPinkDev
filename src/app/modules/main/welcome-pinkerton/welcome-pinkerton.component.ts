import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { CarouselConfig } from 'ngx-bootstrap/carousel';

@Component({
  selector: 'app-welcome-pinkerton',
  templateUrl: './welcome-pinkerton.component.html',
  providers: [
    { provide: CarouselConfig, useValue: { interval: 10000, noPause: false, showIndicators: true } }
 ],
  styleUrls: ['./welcome-pinkerton.component.scss']
})
export class WelcomePinkertonComponent implements OnInit {
  // modalRef: BsModalRef;
  constructor(private router: Router, private modalService: BsModalService) {
  }

  ngOnInit(): void {
  }
  
  closeModalPane() {
    console.log("closeModalPane")
    this.modalService.hide();
    //this.router.navigateByUrl('/main', { skipLocationChange: true });
  }

}
