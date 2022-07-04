import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { T1Component } from './t1/t1.component';
import { T2Component } from './t2/t2.component';
import { T3Component } from './t3/t3.component';

const routes: Routes = [
  {
    path: '',
    component: T1Component
  },
  {
    path: 'task2',
    component: T2Component
  },
  {
    path: 'task3',
    component: T3Component
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
