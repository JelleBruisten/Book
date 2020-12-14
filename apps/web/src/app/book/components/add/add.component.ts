import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { bookProperties, Book } from '@book/interfaces';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BookStore } from '../../store/book.store';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css'],
  providers: [BookStore],
})
export class AddComponent implements OnInit, OnDestroy {
  bookProperties = bookProperties;
  bookForm: FormGroup;
  loading$ = this.bookStore.selectLoading;
  _destroyed$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router,
    private bookStore: BookStore
  ) {}

  ngOnInit(): void {
    this.createForm();

    // saving success
    this.bookStore.selectSaved
      .pipe(takeUntil(this._destroyed$))
      .subscribe(() => {
        alert('saved');
        this.router.navigate(['../'], { relativeTo: this.route });
      });

    // saving error
    this.bookStore.selectErrorSaving
      .pipe(takeUntil(this._destroyed$))
      .subscribe(() => {
        alert('error saving, please try again');
      });
  }

  createForm() {
    const formDefinition = {};
    for (const p of bookProperties) {
      formDefinition[p] = null;
    }
    this.bookForm = this.formBuilder.group(formDefinition);
  }

  saveBook() {
    this.bookStore.addBook(this.bookForm.value as Book);
  }

  ngOnDestroy(): void {
    if (this._destroyed$) {
      this._destroyed$.next();
      this._destroyed$.complete();
    }
  }
}
