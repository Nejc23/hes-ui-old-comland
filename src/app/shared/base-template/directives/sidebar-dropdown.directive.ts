import { Directive, ElementRef, OnChanges, Input } from '@angular/core';
import * as $ from 'jquery';
import { SidebarAnimationState } from '../consts/sidebar-animation.const';

// sidebar dropdown
@Directive({
  selector: '[appSidebarDropdown]'
})
export class SidebarDropdownDirective implements OnChanges {
  @Input() opened = '';

  constructor(private elRef: ElementRef) {}

  ngOnChanges(changes: any) {
    const addOpenClass = () => {
      $(this.elRef.nativeElement).parent().addClass('open');
    };
    const removeClass = () => {
      $(this.elRef.nativeElement).parent().removeClass('open');
    };

    if (changes.opened) {
      if (changes.opened.currentValue === SidebarAnimationState.open) {
        $(this.elRef.nativeElement).parent().children('.dropdown-menu').slideDown(200, addOpenClass);
      } else if (changes.opened.currentValue === SidebarAnimationState.close) {
        $(this.elRef.nativeElement).parent().children('.dropdown-menu').slideUp(200, removeClass);
      }
    }
  }
}
