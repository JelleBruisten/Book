import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from 'src/app/authentication/services/authentication.service';
import { Book, bookProperties } from '../../book';
import { BookService } from '../../services/book.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
})
export class EditComponent implements OnInit {
  bookProperties = bookProperties;
  bookForm: FormGroup;
  isbn: string;
  book: Book;
  loggedin$: Observable<boolean>;

  constructor(
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router,
    private bookService: BookService
  ) {
    this.loggedin$ = this.authenticationService.loggedIn$;
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      if (params.has('isbn')) {
        this.isbn = params.get('isbn');
        this.bookService.getBook(this.isbn).subscribe(
          (book: Book) => {
            this.createForm(book);
            this.book = book;
          },
          () => {
            this.router.navigate(['../../'], { relativeTo: this.route });
          }
        );
      } else {
        this.router.navigate(['../'], { relativeTo: this.route });
      }
    });
  }

  createForm(book: Book) {
    const formDefinition = {};
    for (const p of bookProperties) {
      if (p in book) {
        formDefinition[p] = book[p];
      } else {
        formDefinition[p] = null;
      }
    }
    this.bookForm = this.formBuilder.group(formDefinition);

    if (!this.authenticationService.loggedIn) {
      this.bookForm.disable();
    }
  }

  saveBook() {
    this.bookService
      .updateBook({ ...this.book, ...(this.bookForm.value as Book) })
      .subscribe(() => {
        this.router.navigate(['../'], { relativeTo: this.route });
      });
  }
}
