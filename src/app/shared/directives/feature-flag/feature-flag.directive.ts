import { Directive, Input, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { AppConfigService } from '../../../core/configuration/services/app-config.service';

@Directive({
  // eslint-disable-next-line @angular-eslint/directive-selector
  selector: '[featureFlag]'
})
export class FeatureFlagDirective implements OnInit {
  @Input() featureFlag!: string;

  constructor(private tpl: TemplateRef<any>, private vcr: ViewContainerRef, private appConfigService: AppConfigService) {}

  ngOnInit() {
    const isEnabled = this.appConfigService.isFeatureEnabled(this.featureFlag) || false;
    if (isEnabled) {
      this.vcr.createEmbeddedView(this.tpl);
    }
  }
}
