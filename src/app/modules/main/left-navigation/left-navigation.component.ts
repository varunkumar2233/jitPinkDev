import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'left-navigation',
  templateUrl: './left-navigation.component.html',
  styleUrls: ['./left-navigation.component.scss']
})
export class LeftNavigationComponent implements OnInit {
  public isCollapsed = true;
  constructor(private router: Router) { }
  loadmainpage(){
    this.router.navigateByUrl('/main');

  }
  ngOnInit(): void {
    
  }

}

