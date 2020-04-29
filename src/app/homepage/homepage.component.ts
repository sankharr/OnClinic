import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {

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
