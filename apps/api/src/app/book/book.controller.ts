import type { Book } from '@book/interfaces';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Public } from '../authentication/public.decorator';
import { BookService } from './book.service';

@Controller('book')
export class BookController {
  constructor(private bookService: BookService) {}

  @Public()
  @Get()
  async getBooks(): Promise<Book[]> {
    const books = await this.bookService.getBooks();
    return books;
  }

  @Public()
  @Get(':isbn')
  async getBook(@Param('isbn') isbn: string | number): Promise<Book> {
    const book = await this.bookService.getBook(isbn);
    return book;
  }

  @Post()
  async addBook(@Body() book: Book): Promise<boolean> {
    const result = await this.bookService.addBook(book);
    return result;
  }

  @Put()
  async updateBook(@Body() book: Book): Promise<boolean> {
    const result = await this.bookService.updateBook(book);
    return result;
  }

  @Delete(':isbn')
  async deleteBook(@Param('isbn') isbn: string | number): Promise<boolean> {
    const result = await this.bookService.deleteBook(isbn);
    return result;
  }
}
