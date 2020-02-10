import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { nameOfFactory } from 'src/app/shared/utils/consts/nameOfFactory.const';
import { FormGroup, FormBuilder } from '@angular/forms';
import * as _ from 'lodash';
import { State, UsersSearchFilter } from '../interfaces/user-list.interface';

@Component({
  selector: 'app-users-search',
  templateUrl: './users-search.component.html'
})
export class UsersSearchComponent implements OnInit {
  state = { form: null } as State;
  nameOf = nameOfFactory<UsersSearchFilter>();
  form: FormGroup;
  @Output() search = new EventEmitter<UsersSearchFilter>();
  @Output() resetSearch = new EventEmitter<any>();

  constructor(public fb: FormBuilder) {}

  ngOnInit() {
    this.form = this.createForm();
  }

  createForm(): FormGroup {
    return this.fb.group({
      [this.nameOf('content')]: ''
    });
  }

  getFiltersFromForm() {
    if (!this.state.form) {
      return [];
    }
    const filter = [this.state.form, 'content'];

    return _.filter(filter, x => x !== null && x !== '');
  }

  get searchProperty() {
    return this.nameOf('content');
  }

  onSearch() {
    this.search.emit(this.form.value);
  }

  reset() {
    this.form.setValue({
      [this.nameOf('content')]: ''
    });
    this.resetSearch.emit();
  }
}
