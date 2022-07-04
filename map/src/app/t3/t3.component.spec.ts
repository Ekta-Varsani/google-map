import { ComponentFixture, TestBed } from '@angular/core/testing';

import { T3Component } from './t3.component';

describe('T3Component', () => {
  let component: T3Component;
  let fixture: ComponentFixture<T3Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ T3Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(T3Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
