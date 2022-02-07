import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-slide-out-component',
  templateUrl: './slide-out-component.component.html',
  styleUrls: ['./slide-out-component.component.scss']
})
export class SlideOutComponentComponent {
  @Input() visible = true;
  @Input() contentClass = '';
  @Input() title = '';
  @Input() showHeaderBorder = true;

  @Input() primaryButtonText = this.translate.instant('BUTTON.SAVE');
  @Input() secondaryButtonText = this.translate.instant('BUTTON.CANCEL');
  @Input() hideCloseButton = false;

  @Output() closeButtonClickedEvent = new EventEmitter<boolean>();
  @Output() confirmButtonClickedEvent = new EventEmitter<boolean>();

  constructor(private translate: TranslateService) {}

  close() {
    this.closeButtonClickedEvent.emit(true);
  }

  confirm() {
    this.confirmButtonClickedEvent.emit(true);
  }
}
