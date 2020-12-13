import { HttpException, Injectable } from '@nestjs/common';
import * as faker from 'faker';
import { Book } from '@book/interfaces';

const totalBooks = 12;
faker.seed(123);

@Injectable()
export class BookService {
  private books: Book[] = [];

  constructor() {
    for (let i = 0; i < totalBooks; i++) {
      this.books.push({
        isbn: faker.random.number(),
        title: faker.random.words(5),
        author: `${faker.name.firstName()} ${faker.name.lastName()}`,
        publish_date: faker.date.past(),
        publisher: faker.company.companyName(),
        numOfPages: faker.random.number(),
        cover: faker.random.image(),
        introduction: faker.random.words(100),
      });
    }
  }

  getBooks(): Promise<Book[]> {
    return new Promise<Book[]>((resolve) => {
      resolve([...this.books]);
    });
  }

  getBook(isbn: number | string): Promise<Book> {
    const bookIsbn = Number(isbn);
    return new Promise((resolve) => {
      const book = this.books.find((book) => Number(book.isbn) === bookIsbn);
      if (!book) {
        throw new HttpException('Book does not exist!', 404);
      }
      resolve(book);
    });
  }

  addBook(book: Book): Promise<boolean> {
    return new Promise((resolve) => {
      this.books = [...this.books, book];
      resolve(true);
    });
  }

  updateBook(book: Book): Promise<boolean> {
    const bookIsbn = Number(book?.isbn);
    return new Promise((resolve) => {
      const index = this.books.findIndex(
        (book) => Number(book.isbn) === bookIsbn
      );
      if (index === -1) {
        throw new HttpException('Book does not exist!', 404);
      }
      const books = [
        ...this.books.slice(0, index),
        book,
        ...this.books.slice(index + 1),
      ];
      this.books = books;
      resolve(true);
    });
  }

  deleteBook(isbn: string | number): Promise<boolean> {
    const bookIsbn = Number(isbn);
    return new Promise((resolve) => {
      const index = this.books.findIndex(
        (book) => Number(book.isbn) === bookIsbn
      );
      if (index === -1) {
        throw new HttpException('Book does not exist!', 404);
      }
      const books = [
        ...this.books.slice(0, index),
        ...this.books.slice(index + 1),
      ];
      this.books = books;
      resolve(true);
    });
  }
}
