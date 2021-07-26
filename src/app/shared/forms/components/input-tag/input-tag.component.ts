import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormsUtilsService } from 'src/app/core/forms/services/forms-utils.service';

@Component({
  selector: 'app-input-tag',
  templateUrl: './input-tag.component.html'
})
export class InputTagComponent implements OnInit, OnChanges {
  // required
  @Input() form: FormGroup;
  @Input() property: string;
  @Input() selected: any[];

  // optional
  @Input() label: string;
  @Input() autocompleteItemsAsObjects: any;
  @Input() disabled = false;
  @Input() allowCustomValues = false;
  @Output() valueChanged: EventEmitter<any> = new EventEmitter<any>();
  @Input() translationKey = '';

  controlId: string;
  nextId = 0; // for adding more new values we need to store max id
  addedItems: any = [];
  constructor(private formUtils: FormsUtilsService) {}

  autocompleteItemsAsObjectsWithFake: any[];

  ngOnInit() {
    if (!this.form) {
      throw Error('InputTagComponent - form input missing.');
    }
    if (!this.property) {
      throw Error('InputTagComponent - property input missing.');
    }
  }

  ngOnChanges() {
    this.autocompleteItemsAsObjectsWithFake = [];
    this.addedItems = [];

    if (this.autocompleteItemsAsObjects) {
      this.autocompleteItemsAsObjectsWithFake = this.autocompleteItemsAsObjects.map((v) => ({
        id: v.id,
        value: v.value,
        fakeId: v.id + 1
      }));
    }

    if (this.selected) {
      const values = this.selected.map((s) => ({
        id: s.id,
        value: s.value,
        fakeId: s.id + 1
      }));

      this.formControl.setValue(values);
      for (const value of values) {
        if (!this.autocompleteItemsAsObjects?.find((v) => v.id === value.id)) {
          this.addedItems.push(value);
          this.autocompleteItemsAsObjectsWithFake.push(value);
        }
      }
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
        if (!this.autocompleteItemsAsObjectsWithFake) {
          this.autocompleteItemsAsObjectsWithFake = [];
        }

        const matchingItem: any = this.autocompleteItemsAsObjectsWithFake.find((item: any) => {
          return item?.value?.toLowerCase() === text.toLowerCase();
        });

        const matchingAddedItem: any = this.addedItems.find((item: any) => {
          return item.value.toLowerCase() === text.toLowerCase();
        });

        if (matchingItem) {
          return matchingItem;
        } else if (matchingAddedItem) {
          return null;
        } else {
          if (this.nextId === 0 && this.autocompleteItemsAsObjectsWithFake?.length > 0) {
            this.nextId = Math.max(...this.autocompleteItemsAsObjectsWithFake.map((codelist) => codelist.id)) + 1;
          } else {
            this.nextId += 1;
          }

          const newItem = {
            id: this.nextId,
            fakeId: this.nextId + 1,
            value: text
          };

          this.addedItems.push(newItem);
          // this.autocompleteItemsAsObjects.push(newItem);
          this.autocompleteItemsAsObjectsWithFake.push(newItem);
          return newItem;
        }
      })
    );

  public doValueChange(value: any) {
    this.valueChanged.emit(value);
  }

  removeTag(value: any) {
    if (this.addedItems.length > 0) {
      if (this.addedItems.find((codelist) => codelist.id === value.dataItem.id)) {
        this.autocompleteItemsAsObjectsWithFake = this.autocompleteItemsAsObjectsWithFake.filter(
          (codelist) => codelist.id !== value.dataItem.id
        );
        this.addedItems = this.addedItems.filter((codelist) => codelist.id !== value.dataItem.id);
      }
    }
  }
}
