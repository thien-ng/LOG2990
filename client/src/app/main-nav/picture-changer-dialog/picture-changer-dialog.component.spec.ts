import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PictureChangerDialogComponent } from './picture-changer-dialog.component';

describe('PictureChangerDialogComponent', () => {
  let component: PictureChangerDialogComponent;
  let fixture: ComponentFixture<PictureChangerDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PictureChangerDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PictureChangerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
