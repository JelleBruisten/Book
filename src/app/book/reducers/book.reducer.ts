import { Action, createReducer, on } from '@ngrx/store';
import * as BookActions from '../actions/book.actions';
import { Book } from '../book';

export const bookFeatureKey = 'book';

export interface State {
  bookList: Book[],
  book: Book
}

export const initialState: State = {
  bookList: [],
  book: null
};


export const reducer = createReducer(
  initialState,

  on(BookActions.loadBooks, state => state),
  on(BookActions.loadBooksSuccess, (state, action) => state),
  on(BookActions.loadBooksFailure, (state, action) => state),

);

