import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
@Component({
  selector: 'app-identity-error',
  templateUrl: './identity-error.component.html'
})
export class IdentityErrorComponent implements OnInit {
  constructor(private route: ActivatedRoute) {}

  error = '';
  ngOnInit() {
    this.route.params.subscribe((params: Params) => (this.error = params['error']));
  }
}
