import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MsalAuthComponent } from './msal-auth.component';

describe('MsalAuthComponent', () => {
  let component: MsalAuthComponent;
  let fixture: ComponentFixture<MsalAuthComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MsalAuthComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MsalAuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
