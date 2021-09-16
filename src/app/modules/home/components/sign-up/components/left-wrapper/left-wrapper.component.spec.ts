import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeftWrapperComponent } from './left-wrapper.component';

describe('LeftWrapperComponent', () => {
  let component: LeftWrapperComponent;
  let fixture: ComponentFixture<LeftWrapperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeftWrapperComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeftWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
