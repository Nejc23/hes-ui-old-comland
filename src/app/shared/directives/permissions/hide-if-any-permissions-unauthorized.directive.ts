import { Directive, ElementRef, OnInit, Input } from '@angular/core';
import { PermissionEnumerator } from 'src/app/core/permissions/enumerators/permission-enumerator.model';
import { PermissionService } from 'src/app/core/permissions/services/permission.service';

@Directive({
  selector: '[appHideIfAnyPermissionsUnauthorized]'
})
export class HideIfAnyPermissionsUnauthorizedDirective implements OnInit {
  @Input() permissions: PermissionEnumerator[]; // Required permissions passed in

  constructor(private el: ElementRef, private authorizationService: PermissionService) {}

  ngOnInit() {
    if (this.permissions.find((a) => !this.authorizationService.hasAccess(a))) {
      this.el.nativeElement.style.display = 'none';
    }
  }
}
