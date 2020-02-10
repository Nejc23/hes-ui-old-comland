import { Directive, ElementRef, OnInit, Input } from '@angular/core';
import { PermissionsService } from '../../../core/permissions/services/permissions.service';
import { FunctionalityEnumerator } from '../../../core/permissions/enumerators/functionality-enumerator.model';

@Directive({
  selector: '[appHideIfAuthorizedReadonly]'
})
export class HideIfAuthorizedReadonlyDirective implements OnInit {
  @Input('appHideIfAuthorizedReadonly') permission: FunctionalityEnumerator; // Required permission passed in

  constructor(private el: ElementRef, private authorizationService: PermissionsService) {}

  ngOnInit() {
    if (!this.authorizationService.hasEditAccess(this.permission)) {
      this.el.nativeElement.style.display = 'none';
    }
  }
}
