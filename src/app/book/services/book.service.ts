import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Book } from '../book';

const apiUrl = "http://localhost:3000/book";

@Injectable({
  providedIn: 'root'
})
export class BookService {

  
  constructor(private http: HttpClient) { }

  getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(apiUrl);
  }

  getBook(isbn: number): Observable<Book> {
    return this.http.get<Book>(`${apiUrl}/${isbn}`);
  }

  addBook(book: Book): Observable<any> {
    return this.http.post(`${apiUrl}`, book);
  }

  updateBook(book: Book): Observable<any> {
    return this.http.post(`${apiUrl}/${book.isbn}`, book);
  }

  deleteBook(book: Book): Observable<any> {
    return this.http.delete(`${apiUrl}/${book.isbn}`);
  }
}
