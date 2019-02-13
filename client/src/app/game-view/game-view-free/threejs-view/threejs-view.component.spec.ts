import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TheejsViewComponent } from './threejs-view.component';

describe('TheejsViewComponent', () => {
  let component: TheejsViewComponent;
  let fixture: ComponentFixture<TheejsViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TheejsViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TheejsViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
