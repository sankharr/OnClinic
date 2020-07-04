import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-testing',
  templateUrl: './testing.component.html',
  styleUrls: ['./testing.component.css']
})
export class TestingComponent implements OnInit {

  user: firebase.User;
  userID: any;

  result: any;

  showThis: boolean = false;

  constructor(
    private auth: AuthService,
    private db: AngularFirestore
  ) { }

  ngOnInit() {
    this.auth.getUserState()
     .subscribe( user => {
         this.user = user;
     })

     this.userID = localStorage.getItem("uid");

     this.db.collection("Users",ref => (ref.where("role","==","doctor"))).valueChanges()
     .subscribe(output => {
        this.result = output;
        console.log("user data - ",this.result);
     })

  }

  buttonPress(){
    this.showThis = true;
  }

}
