import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { bookProperties, Book } from '@book/interfaces';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { AuthFacade } from '../../../store/auth/auth.facade';
import { BookStore } from '../../store/book.store';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
  providers: [BookStore],
})
export class EditComponent implements OnInit, OnDestroy {
  bookProperties = bookProperties;
  bookForm: FormGroup;
  loggedin$ = this.authFacade.authenticated$;
  loading$ = this.bookStore.selectLoading;
  _destroyed$ = new Subject<void>();

  constructor(
    private authFacade: AuthFacade,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router,
    private bookStore: BookStore
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params: ParamMap) => {
      if (params.has('isbn')) {
        const isbn = params.get('isbn');
        this.bookStore.getBook(isbn);
      } else {
        this.router.navigate(['../'], { relativeTo: this.route });
      }
    });

    // loading success
    this.bookStore.selectBook
      .pipe(
        takeUntil(this._destroyed$),
        filter((a) => !!a)
      )
      .subscribe((book: Book) => {
        this.createForm(book);
      });

    // loading error
    this.bookStore.selectErrorLoading
      .pipe(takeUntil(this._destroyed$))
      .subscribe(() => {
        this.router.navigate(['../../'], { relativeTo: this.route });
      });

    // saving success
    this.bookStore.selectSaved
      .pipe(takeUntil(this._destroyed$))
      .subscribe(() => {
        alert('saved');
        this.router.navigate(['../../'], { relativeTo: this.route });
      });

    // saving error
    this.bookStore.selectErrorSaving
      .pipe(takeUntil(this._destroyed$))
      .subscribe(() => {
        alert('error saving, please try again');
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
  }

  saveBook() {
    this.bookStore.updateBook(this.bookForm.value as Book);
  }

  ngOnDestroy(): void {
    if (this._destroyed$) {
      this._destroyed$.next();
      this._destroyed$.complete();
    }
  }
}
