import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VanStocksComponent } from './van-stocks.component';

describe('VanStocksComponent', () => {
  let component: VanStocksComponent;
  let fixture: ComponentFixture<VanStocksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VanStocksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VanStocksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
