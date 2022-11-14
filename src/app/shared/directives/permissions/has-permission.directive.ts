import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { PermissionService } from 'src/app/core/permissions/services/permission.service';
import { PermissionEnumerator } from 'src/app/core/permissions/enumerators/permission-enumerator.model';

@Directive({
  selector: '[appHasPermission]'
})
export class HasPermissionDirective {
  private permission: PermissionEnumerator;

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authorizationService: PermissionService
  ) {}

  @Input()
  set appHasPermission(val: PermissionEnumerator) {
    this.permission = val;
    this.updateView();
  }

  private updateView() {
    if (this.authorizationService.hasAccess(this.permission)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
