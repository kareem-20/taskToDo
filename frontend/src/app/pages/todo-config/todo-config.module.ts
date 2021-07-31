import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TodoConfigPageRoutingModule } from './todo-config-routing.module';

import { TodoConfigPage } from './todo-config.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TodoConfigPageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [TodoConfigPage]
})
export class TodoConfigPageModule { }
