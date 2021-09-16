import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GetSampleReportsComponent } from './get-sample-reports.component';

describe('GetSampleReportsComponent', () => {
  let component: GetSampleReportsComponent;
  let fixture: ComponentFixture<GetSampleReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GetSampleReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GetSampleReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
