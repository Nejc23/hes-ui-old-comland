import { Directive, ElementRef, OnInit, Input } from '@angular/core';
import { PermissionService } from 'src/app/core/permissions/services/permission.service';
import { PermissionEnumerator } from 'src/app/core/permissions/enumerators/permission-enumerator.model';

@Directive({
  selector: '[appHideIfPermissionUnauthorized]'
})
export class HideIfPermissionUnauthorizedDirective implements OnInit {
  @Input() permission: PermissionEnumerator; // Required permissions passed in

  constructor(private el: ElementRef, private authorizationService: PermissionService) {}

  ngOnInit() {
    if (!this.authorizationService.hasAccess(this.permission)) {
      this.el.nativeElement.style.display = 'none';
    }
  }
}
