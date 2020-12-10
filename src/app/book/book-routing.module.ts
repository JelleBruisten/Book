import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddComponent } from './components/add/add.component';
import { EditComponent } from './components/edit/edit.component';
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
    path: 'add',
    component: AddComponent
  },
  {
    path: 'edit/:isbn',
    component: EditComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BookRoutingModule { }
