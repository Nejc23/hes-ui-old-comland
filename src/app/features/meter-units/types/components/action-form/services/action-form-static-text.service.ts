import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class ActionFormStaticTextService {
  constructor(private translate: TranslateService) {}

  get placeholderSearch() {
    return this.translate.instant('COMMON.SEARCH');
  }

  preventCloseDropDownWhenClickInsideMenu() {
    $('.dropdown-menu').on('click.bs.dropdown', (e) => {
      e.stopPropagation();
      // e.preventDefault();
    });
  }

  removePopupBackdropIfClickOnMenu() {
    $(document.body).removeClass('modal-open');
    $('.modal-backdrop').remove();
  }
}
