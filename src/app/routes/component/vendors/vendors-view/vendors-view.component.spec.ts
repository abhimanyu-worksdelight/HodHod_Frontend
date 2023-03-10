import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorsViewComponent } from './vendors-view.component';

describe('VendorsViewComponent', () => {
  let component: VendorsViewComponent;
  let fixture: ComponentFixture<VendorsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VendorsViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
