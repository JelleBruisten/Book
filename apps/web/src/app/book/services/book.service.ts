import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book } from '@book/interfaces';
import { environment } from '../../../environments/environment';

const apiUrl = environment.apiURL + '/book';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  constructor(private http: HttpClient) {}

  getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(apiUrl);
  }

  getBook(isbn: number | string): Observable<Book> {
    return this.http.get<Book>(`${apiUrl}/${isbn}`);
  }

  addBook(book: Book): Observable<unknown> {
    return this.http.post(`${apiUrl}`, book);
  }

  updateBook(book: Book): Observable<unknown> {
    return this.http.put(`${apiUrl}`, book);
  }

  deleteBook(book: Book): Observable<unknown> {
    return this.http.delete(`${apiUrl}/${book.isbn}`);
  }
}
