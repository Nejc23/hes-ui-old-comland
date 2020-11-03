import { Component, OnInit, Input, ViewChild, HostListener, Output, EventEmitter } from '@angular/core';
import { FormGroup, AbstractControl, FormControl } from '@angular/forms';
import { FormsUtilsService } from 'src/app/core/forms/services/forms-utils.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-input-tag',
  templateUrl: './input-tag.component.html'
})
export class InputTagComponent implements OnInit {
  // required
  @Input() form: FormGroup;
  @Input() property: string;

  // optional
  @Input() label: string;
  @Input() autocompleteItemsAsObjects: any;
  @Input() disabled = false;
  @Input() allowCustomValues = false;
  @Output() valueChanged: EventEmitter<any> = new EventEmitter<any>();

  controlId: string;
  nextId = 0; // for adding more new values we need to store max id
  addedItems: any = [];
  constructor(private formUtils: FormsUtilsService) {}

  ngOnInit() {
    if (!this.form) {
      throw Error('InputTextComponent - form input missing.');
    }
    if (!this.property) {
      throw Error('InputTextComponent - property input missing.');
    }
  }

  get formControl(): AbstractControl {
    return this.form.get(this.property);
  }

  get required(): boolean {
    return this.formUtils.hasFormControlRequiredField(this.formControl);
  }

  showErrors(): boolean {
    return this.formUtils.shouldInputShowErrors(this.formControl);
  }

  public valueNormalizer = (text$: Observable<string>) =>
    text$.pipe(
      map((text: string) => {
        const matchingItem: any = this.autocompleteItemsAsObjects.find((item: any) => {
          return item.value.toLowerCase() === text.toLowerCase();
        });

        const matchingAddedItem: any = this.addedItems.find((item: any) => {
          return item.value.toLowerCase() === text.toLowerCase();
        });

        if (matchingItem) {
          return matchingItem;
        } else if (matchingAddedItem) {
          return null;
        } else {
          if (this.nextId === 0) {
            this.nextId = Math.max(...this.autocompleteItemsAsObjects.map(codelist => codelist.id)) + 1;
          } else {
            this.nextId += 1;
          }
          const newItem = {
            id: this.nextId,
            value: text
          };
          this.addedItems.push(newItem);
          this.autocompleteItemsAsObjects.push(newItem);
          return newItem;
        }
      })
    );

  public doValueChange(value: any) {
    this.valueChanged.emit(value);
  }
}
