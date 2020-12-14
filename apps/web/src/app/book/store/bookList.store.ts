import { Injectable } from '@angular/core';
import { Book } from '@book/interfaces';
import { ComponentStore } from '@ngrx/component-store';
import { Observable, of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { BookService } from '../services/book.service';

export interface bookListState {
  books: Book[];
  loading: boolean;
  error: boolean;
}

const initialBookListState = {
  books: [],
  loading: false,
  error: false,
};

@Injectable()
export class BookListStore extends ComponentStore<bookListState> {
  constructor(private bookService: BookService) {
    super(initialBookListState);
  }

  /**
   * Selectors
   */
  readonly selectBooks = this.select((state) => {
    return state.books;
  });

  readonly selectLoading = this.select((state) => {
    return state.loading;
  });

  readonly selectErrors = this.select((state) => {
    return state.error;
  });

  /**
   * Updaters
   */
  readonly setBooks = this.updater((state: bookListState, books: Book[]) => {
    return {
      ...state,
      books: books,
    };
  });

  readonly setLoading = this.updater(
    (state: bookListState, newLoadingState: boolean) => {
      return {
        ...state,
        loading: newLoadingState,
      };
    }
  );

  readonly setError = this.updater(
    (state: bookListState, newErrorState: boolean) => {
      return {
        ...state,
        error: newErrorState,
      };
    }
  );

  /**
   * effects
   */
  readonly loadBooks = this.effect((origin$: Observable<void>) =>
    origin$.pipe(
      tap(() => {
        this.setError(false);
        this.setLoading(true);
      }),
      switchMap(() => {
        return this.bookService.getBooks().pipe(
          catchError((e) => {
            this.setError(true);
            return of(e);
          })
        );
      }),
      tap((books: Book[]) => {
        this.setLoading(false);
        this.setBooks(books);
      })
    )
  );

  readonly deleteBook = this.effect((origin$: Observable<Book>) =>
    origin$.pipe(
      tap(() => {
        this.setError(false);
        this.setLoading(true);
      }),
      switchMap((book: Book) => {
        return this.bookService.deleteBook(book).pipe(
          map(() => book),
          catchError((e) => {
            this.setError(true);
            return of(e);
          })
        );
      }),
      tap((book: Book) => {
        this.setLoading(false);
        const currentBooks = this.get().books;
        const index = currentBooks.indexOf(book);
        const nextBooks = [
          ...currentBooks.slice(0, index),
          ...currentBooks.slice(index + 1),
        ];
        this.setBooks(nextBooks);
      })
    )
  );
}
