import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchasedReportsComponent } from './purchased-reports.component';

describe('PurchasedReportsComponent', () => {
  let component: PurchasedReportsComponent;
  let fixture: ComponentFixture<PurchasedReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchasedReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchasedReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
