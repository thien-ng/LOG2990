import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiffCounterComponent } from './diff-counter.component';

describe('DiffCounterComponent', () => {
  let component: DiffCounterComponent;
  let fixture: ComponentFixture<DiffCounterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiffCounterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiffCounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
