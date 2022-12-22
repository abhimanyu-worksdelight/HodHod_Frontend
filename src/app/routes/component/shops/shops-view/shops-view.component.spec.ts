import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopsViewComponent } from './shops-view.component';

describe('ShopsViewComponent', () => {
  let component: ShopsViewComponent;
  let fixture: ComponentFixture<ShopsViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShopsViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShopsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
