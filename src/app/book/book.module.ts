import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BookRoutingModule } from './book-routing.module';
import { OverviewComponent } from './components/overview/overview.component';
import { CreateComponent } from './components/create/create.component';
import { ViewComponent } from './components/view/view.component';



@NgModule({
  declarations: [OverviewComponent, CreateComponent, ViewComponent],
  imports: [
    CommonModule,
    BookRoutingModule
  ]
})
export class BookModule { }
