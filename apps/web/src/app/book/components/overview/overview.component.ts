import { Component, OnInit } from '@angular/core';
import { Book } from '@book/interfaces';
import { ComponentStore } from '@ngrx/component-store';
import { AuthFacade } from '../../../store/auth/auth.facade';
import { BookService } from '../../services/book.service';
import { BookStore } from '../../store/book.store';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css'],
  providers: [BookStore],
})
export class OverviewComponent implements OnInit {
  displayedColumns: string[] = [
    'isbn',
    'title',
    'author',
    'publish_date',
    'actions',
  ];

  books$ = this.bookStore.selectBooks;
  loggedin$ = this.authFacade.authenticated$;
  loading$ = this.bookStore.selectLoading;

  constructor(private authFacade: AuthFacade, private bookStore: BookStore) {}

  ngOnInit(): void {
    this.bookStore.loadBooks();
  }

  deleteBook(book: Book) {
    if (confirm(`You sure u want to delete book "${book.title}"?`)) {
      this.bookStore.deleteBook(book);
    }
  }
}
