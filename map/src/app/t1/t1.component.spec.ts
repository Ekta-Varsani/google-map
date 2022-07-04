import { ComponentFixture, TestBed } from '@angular/core/testing';

import { T1Component } from './t1.component';

describe('T1Component', () => {
  let component: T1Component;
  let fixture: ComponentFixture<T1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ T1Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(T1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
