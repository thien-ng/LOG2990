import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChronometreComponent } from './chronometre.component';

describe('ChronometreComponent', () => {
  let component: ChronometreComponent;
  let fixture: ComponentFixture<ChronometreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChronometreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChronometreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
