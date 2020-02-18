import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
@Component({
  selector: 'app-page-404',
  templateUrl: './page-404.component.html'
})
export class Page404Component implements OnInit {
  constructor(public router: Router) {}

  ngOnInit() {}
}
