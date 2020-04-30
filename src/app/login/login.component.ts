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

  //related to email password login
  authError: any

  constructor(
    private auth:AuthService,
    private router:Router
  ) { }
 
  ngOnInit() {
    //related to email password login
    this.auth.eventAuthErrors$.subscribe ( data => {
      this.authError = data;
    })
  }

  //related to email password login
  login(frm) {
    this.auth.login(frm.value.email, frm.value.password);
  }

}
