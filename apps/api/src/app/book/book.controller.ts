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
import { Book } from '@book/interfaces';

@Controller('book')
export class BookController {
  constructor(private bookService: BookService) {}

  @Public()
  @Get()
  async getBooks() {
    const books = await this.bookService.getBooks();
    return books;
  }

  @Public()
  @Get(':isbn')
  async getBook(@Param('isbn') isbn: string | number) {
    const book = await this.bookService.getBook(isbn);
    return book;
  }

  @Post()
  async addBook(@Body() book: Book) {
    const result = await this.bookService.addBook(book);
    return result;
  }

  @Put()
  async updateBook(@Body() book: Book) {
    const result = await this.bookService.updateBook(book);
    return result;
  }

  @Delete(':isbn')
  async deleteBook(@Param('isbn') isbn: string | number) {
    const result = await this.bookService.deleteBook(isbn);
    return result;
  }
}
