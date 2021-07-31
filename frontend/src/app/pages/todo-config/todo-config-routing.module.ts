import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TodoConfigPage } from './todo-config.page';

const routes: Routes = [
  {
    path: '',
    component: TodoConfigPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TodoConfigPageRoutingModule {}
