import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  focus;
  focus1;

  authError: any

  constructor(
    private auth:AuthService,
    private router:Router
  ) { }
 
  ngOnInit() {
    this.auth.eventAuthErrors$.subscribe ( data => {
      this.authError = data;
    })
  }

  login(frm) {
    this.auth.login(frm.value.email, frm.value.password);
  }

}
