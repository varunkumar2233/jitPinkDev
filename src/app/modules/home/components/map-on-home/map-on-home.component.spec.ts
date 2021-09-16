import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapOnHomeComponent } from './map-on-home.component';

describe('MapOnHomeComponent', () => {
  let component: MapOnHomeComponent;
  let fixture: ComponentFixture<MapOnHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapOnHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapOnHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
