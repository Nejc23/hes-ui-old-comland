import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-slide-out-component',
  templateUrl: './slide-out-component.component.html',
  styleUrls: ['./slide-out-component.component.scss']
})
export class SlideOutComponentComponent implements OnInit {
  @Input() visible = true;
  @Input() contentClass = '';
  @Input() title = '';

  @Output() closeButtonClicked = new EventEmitter<boolean>();

  constructor() {}

  ngOnInit(): void {}

  close() {
    this.closeButtonClicked.emit(true);
  }
}
