import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalStocksComponent } from './total-stocks.component';

describe('TotalStocksComponent', () => {
  let component: TotalStocksComponent;
  let fixture: ComponentFixture<TotalStocksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TotalStocksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TotalStocksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
