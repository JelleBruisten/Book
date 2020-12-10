import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateComponent } from './components/create/create.component';
import { OverviewComponent } from './components/overview/overview.component';

const routes: Routes = [
  {
    path : '',
    component: OverviewComponent
  },
  {
    path: 'overview',
    component: OverviewComponent
  },
  {
    path: 'create',
    component: CreateComponent
  },
  {
    path: 'view/:isbn'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BookRoutingModule { }
