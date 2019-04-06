import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DifferenceCounterComponent } from './difference-counter.component';

describe('DifferenceCounterComponent', () => {
  let component: DifferenceCounterComponent;
  let fixture: ComponentFixture<DifferenceCounterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DifferenceCounterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DifferenceCounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
