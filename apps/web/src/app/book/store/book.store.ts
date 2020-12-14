import { Injectable } from '@angular/core';
import { Book } from '@book/interfaces';
import { ComponentStore } from '@ngrx/component-store';
import { Observable, of } from 'rxjs';
import {
  catchError,
  distinctUntilChanged,
  filter,
  map,
  switchMap,
  tap,
} from 'rxjs/operators';
import { BookService } from '../services/book.service';

export interface bookState {
  book: Book;
  loading: boolean;
  errorLoading: boolean;
  errorSaving: boolean;
  saved: boolean;
}

const initialBookState = {
  book: null,
  loading: false,
  errorSaving: false,
  errorLoading: false,
  saved: false,
};

const filterNonTruthy = filter((a) => !!a);

@Injectable()
export class BookStore extends ComponentStore<bookState> {
  constructor(private bookService: BookService) {
    super(initialBookState);
  }

  /**
   * Selectors
   */
  readonly selectBook = this.select((state) => {
    return state.book;
  });

  readonly selectLoading = this.select((state) => {
    return state.loading;
  }).pipe(distinctUntilChanged(), filterNonTruthy);

  readonly selectErrorSaving = this.select((state) => {
    return state.errorSaving;
  }).pipe(distinctUntilChanged(), filterNonTruthy);

  readonly selectErrorLoading = this.select((state) => {
    return state.errorLoading;
  }).pipe(distinctUntilChanged(), filterNonTruthy);

  readonly selectSaved = this.select((state) => {
    return state.saved;
  }).pipe(distinctUntilChanged(), filterNonTruthy);

  /**
   * Updaters
   */
  readonly setBook = this.updater((state: bookState, book: Book) => {
    return {
      ...state,
      book: book,
    };
  });

  readonly setLoading = this.updater(
    (state: bookState, newLoadingState: boolean) => {
      return {
        ...state,
        loading: newLoadingState,
      };
    }
  );

  readonly setError = this.updater(
    (state: bookState, newErrorState: boolean) => {
      return {
        ...state,
        error: newErrorState,
      };
    }
  );

  readonly setSaved = this.updater(
    (state: bookState, newSaveState: boolean) => {
      return {
        ...state,
        saved: newSaveState,
      };
    }
  );

  /**
   * effects
   */
  readonly getBook = this.effect((origin$: Observable<string>) =>
    origin$.pipe(
      tap(() => {
        this.setError(false);
        this.setLoading(true);
      }),
      switchMap((isbn: string) => {
        return this.bookService.getBook(isbn).pipe(
          catchError((e) => {
            this.setError(true);
            return of(e);
          })
        );
      }),
      tap((book: Book) => {
        this.setLoading(false);
        this.setBook(book);
      })
    )
  );

  readonly addBook = this.effect((origin$: Observable<Book>) =>
    origin$.pipe(
      tap(() => {
        this.setError(false);
        this.setLoading(true);
      }),
      switchMap((book: Book) => {
        return this.bookService.addBook(book).pipe(
          catchError((e) => {
            this.setError(true);
            return of(e);
          })
        );
      }),
      tap(() => {
        this.setLoading(false);
        this.setSaved(true);
      })
    )
  );

  readonly updateBook = this.effect((origin$: Observable<Book>) =>
    origin$.pipe(
      tap(() => {
        this.setError(false);
        this.setLoading(true);
      }),
      switchMap((book: Book) => {
        return this.bookService.updateBook(book).pipe(
          catchError((e) => {
            this.setError(true);
            return of(e);
          })
        );
      }),
      tap(() => {
        this.setLoading(false);
        this.setSaved(true);
      })
    )
  );
}
