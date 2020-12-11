import { Component, OnInit } from '@angular/core';
import { Book } from '../../book';
import { BookService } from '../../services/book.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.css'],
})
export class OverviewComponent implements OnInit {
  displayedColumns: string[] = [
    'isbn',
    'title',
    'author',
    'publish_date',
    'actions',
  ];
  books: Book[];

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.bookService
      .getBooks()
      .subscribe((books: Book[]) => (this.books = books));
  }

  deleteBook(book: Book) {
    if (confirm(`You sure u want to delete book "${book.title}"?`)) {
      this.bookService.deleteBook(book).subscribe((message) => {
        alert(message);
        // deleted from api, lets delete it from our data source aswell now.
        const index = this.books.indexOf(book);
        const books = [
          ...this.books.slice(0, index),
          ...this.books.slice(index + 1),
        ];
        this.books = books;
      });
    }
  }
}
