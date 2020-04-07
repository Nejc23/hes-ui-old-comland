import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-registers-select',
  templateUrl: './registers-select.component.html'
})
export class RegistersSelectComponent implements OnInit {
  @Input() type = 'meter';

  constructor() {}

  ngOnInit() {}
}
