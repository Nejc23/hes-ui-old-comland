import { Directive, ElementRef, OnInit, Input } from '@angular/core';
import { PermissionService } from 'src/app/core/permissions/services/permission.service';
import { PermissionEnumerator } from 'src/app/core/permissions/enumerators/permission-enumerator.model';

@Directive({
  selector: '[appHideDividerIfPermissionsUnauthorized]'
})
export class HideDividerIfPermissionsUnauthorizedDirective implements OnInit {
  @Input() permissionsAbove: PermissionEnumerator[]; // Required permissions passed in
  @Input() permissionsBelow: PermissionEnumerator[]; // Required permissions passed in

  constructor(private el: ElementRef, private authorizationService: PermissionService) {}

  ngOnInit() {
    if (
      !this.permissionsAbove.find((a) => this.authorizationService.hasAccess(a)) ||
      !this.permissionsBelow.find((a) => this.authorizationService.hasAccess(a))
    ) {
      this.el.nativeElement.style.display = 'none';
    }
  }
}
