import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup, AbstractControl } from '@angular/forms';
import { FormsUtilsService } from 'src/app/core/forms/services/forms-utils.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

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

  constructor(private formUtils: FormsUtilsService) {}

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
        debugger;
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
    let tooltip = $localize`Wildcards search is disabled`;
    if (this.useWildcards) {
      tooltip = $localize`Wildcards search is enabled`;
    }
    return tooltip;
  }
}
