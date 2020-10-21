import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ActionFormStaticTextService {
  constructor() {}

  get placeholderSearch() {
    return $localize`Search`;
  }

  preventCloseDropDownWhenClickInsideMenu() {
    $('.dropdown-menu').on('click.bs.dropdown', e => {
      e.stopPropagation();
      // e.preventDefault();
    });
  }

  removePopupBackdropIfClickOnMenu() {
    $(document.body).removeClass('modal-open');
    $('.modal-backdrop').remove();
  }
}
