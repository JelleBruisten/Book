import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { Book, bookProperties } from '../../book';
import { BookService } from '../../services/book.service';

@Component({
  selector: 'app-add',
  templateUrl: './add.component.html',
  styleUrls: ['./add.component.css']
})
export class AddComponent implements OnInit {

  bookProperties = bookProperties;
  bookForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router,
    private bookService: BookService
  ) { }

  ngOnInit(): void {
    const formDefinition = {};
    for(const p of bookProperties) {
      formDefinition[p] = null;
    }
    this.bookForm = this.formBuilder.group(formDefinition);
  }

  saveBook() {
    this.bookService.addBook(this.bookForm.value as Book).subscribe(() => {
      this.router.navigate(['../'], { relativeTo: this.route });
    });
  }
}
