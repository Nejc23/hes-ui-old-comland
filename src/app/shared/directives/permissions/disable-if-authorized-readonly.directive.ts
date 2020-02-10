import { Directive, ElementRef, OnInit, Input } from '@angular/core';
import { PermissionsService } from '../../../core/permissions/services/permissions.service';
import { FunctionalityEnumerator } from '../../../core/permissions/enumerators/functionality-enumerator.model';

@Directive({
  selector: '[appDisableIfAuthorizedReadonly]'
})
export class DisableIfAuthorizedReadonlyDirective implements OnInit {
  @Input('appDisableIfAuthorizedReadonly') permission: FunctionalityEnumerator; // Required permission passed in

  constructor(private el: ElementRef, private authorizationService: PermissionsService) {}

  ngOnInit() {
    if (!this.authorizationService.hasEditAccess(this.permission)) {
      this.el.nativeElement.disabled = true;
    }
  }
}
