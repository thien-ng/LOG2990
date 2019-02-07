import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateFreeGameComponent } from './create-free-game.component';

describe('CreateFreeGameComponent', () => {
  let component: CreateFreeGameComponent;
  let fixture: ComponentFixture<CreateFreeGameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateFreeGameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateFreeGameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
