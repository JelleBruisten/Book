import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BookRoutingModule } from './book-routing.module';
import { OverviewComponent } from './components/overview/overview.component';
import { StoreModule } from '@ngrx/store';
import * as fromBook from './reducers/book.reducer';
import { EffectsModule } from '@ngrx/effects';
import { BookEffects } from './effects/book.effects';
import { AddComponent } from './components/add/add.component';
import { EditComponent } from './components/edit/edit.component';

@NgModule({
  declarations: [OverviewComponent, AddComponent, EditComponent],
  imports: [
    CommonModule,
    BookRoutingModule,
    StoreModule.forFeature(fromBook.bookFeatureKey, fromBook.reducer),
    EffectsModule.forFeature([BookEffects])
  ]
})
export class BookModule { }
