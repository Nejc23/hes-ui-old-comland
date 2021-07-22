import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-input-searcher',
  templateUrl: './input-searcher.component.html'
})
export class InputSearcherComponent implements OnInit {
  // required
  @Input() form: FormGroup;
  @Input() property: string;

  // optional
  @Input() isReadOnly = false; // input text is only readyonly (disabled for editing)
  @Input() placeholder = '';
  @Input() debounceTimeOut = 700;

  @Output() insertedValue = new EventEmitter<string>();

  @Input() showUseWildcard = false;
  @Input() useWildcards = false;
  @Output() toggleWildcards = new EventEmitter<boolean>();

  constructor(private translate: TranslateService) {}

  ngOnInit() {
    if (!this.form) {
      throw Error('InputSearcherComponent - form input missing.');
    }
    if (!this.property) {
      throw Error('InputSearcherComponent - property input missing.');
    }
    if (!this.isReadOnly) {
      this.isReadOnly = false;
    }

    this.form
      .get(this.property)
      .valueChanges.pipe(debounceTime(this.debounceTimeOut))
      .subscribe((data) => {
        this.insertedValue.emit(data);
      });
  }

  get formControl(): AbstractControl {
    return this.form.get(this.property);
  }

  toggleUseWildcards() {
    this.useWildcards = !this.useWildcards;
    this.toggleWildcards.emit(this.useWildcards);
  }

  getTooltip() {
    let tooltip = this.translate.instant('COMMON.WILDCARDS-SEARCH-DISABLED');
    if (this.useWildcards) {
      tooltip = this.translate.instant('COMMON.WILDCARDS-SEARCH-ENABLED');
    }
    return tooltip;
  }
}
