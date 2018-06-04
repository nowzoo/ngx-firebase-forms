import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoFormBuilderComponent } from './demo-form-builder.component';

describe('DemoFormBuilderComponent', () => {
  let component: DemoFormBuilderComponent;
  let fixture: ComponentFixture<DemoFormBuilderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemoFormBuilderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemoFormBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
