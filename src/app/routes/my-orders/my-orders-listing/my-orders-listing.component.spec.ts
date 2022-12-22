import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MyOrdersListingComponent } from './my-orders-listing.component';

describe('MyOrdersListingComponent', () => {
  let component: MyOrdersListingComponent;
  let fixture: ComponentFixture<MyOrdersListingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MyOrdersListingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MyOrdersListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
