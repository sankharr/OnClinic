import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-system-users',
  templateUrl: './system-users.component.html',
  styleUrls: ['./system-users.component.css']
})
export class SystemUsersComponent implements OnInit {
  results: any[];

  constructor(
    private db: AngularFirestore
  ) { }

  ngOnInit(): void {
    this.db.collection("Users").valueChanges()
    .subscribe(output => {
      this.results = output;
    })
  }

}
