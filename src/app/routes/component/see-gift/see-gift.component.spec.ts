import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeeGiftComponent } from './see-gift.component';

describe('SeeGiftComponent', () => {
  let component: SeeGiftComponent;
  let fixture: ComponentFixture<SeeGiftComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeeGiftComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeeGiftComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
