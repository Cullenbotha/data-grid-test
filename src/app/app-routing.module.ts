import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { TodosTableComponent } from "./todos/todos-table/todos-table.component";

const routes: Routes = [
  {path: '', component: TodosTableComponent},
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
