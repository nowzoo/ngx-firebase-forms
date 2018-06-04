import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoFormControlComponent } from './demo-form-control.component';

describe('DemoFormControlComponent', () => {
  let component: DemoFormControlComponent;
  let fixture: ComponentFixture<DemoFormControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemoFormControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemoFormControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
