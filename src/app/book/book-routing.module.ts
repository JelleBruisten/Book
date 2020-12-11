import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AddComponent } from './components/add/add.component';
import { EditComponent } from './components/edit/edit.component';
import { OverviewComponent } from './components/overview/overview.component';

const routes: Routes = [
  {
    path : '',
    component: OverviewComponent,
    // redirectTo: './overview',
    pathMatch: 'full'
  },
  {
    path: 'add',
    component: AddComponent
  },
  {
    path: 'edit/:isbn',
    component: EditComponent,
  },
  {
    path: 'edit',
    pathMatch: 'full',
    redirectTo : '',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BookRoutingModule { }
