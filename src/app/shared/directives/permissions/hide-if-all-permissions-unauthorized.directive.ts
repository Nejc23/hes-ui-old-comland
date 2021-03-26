import { Directive, ElementRef, OnInit, Input } from '@angular/core';
import { PermissionService } from 'src/app/core/permissions/services/permission.service';
import { PermissionEnumerator } from 'src/app/core/permissions/enumerators/permission-enumerator.model';

@Directive({
  selector: '[appHideIfAllPermissionsUnauthorized]'
})
export class HideIfAllPermissionsUnauthorizedDirective implements OnInit {
  @Input() permissions: PermissionEnumerator[]; // Required permissions passed in

  constructor(private el: ElementRef, private authorizationService: PermissionService) {}

  ngOnInit() {
    if (!this.permissions.find((a) => this.authorizationService.hasAccess(a))) {
      this.el.nativeElement.style.display = 'none';
    }
  }
}
