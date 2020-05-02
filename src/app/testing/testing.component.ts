import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-testing',
  templateUrl: './testing.component.html',
  styleUrls: ['./testing.component.css']
})
export class TestingComponent implements OnInit {

  user: firebase.User;

  constructor(
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.auth.getUserState()
     .subscribe( user => {
         this.user = user;
     })
  }

}
