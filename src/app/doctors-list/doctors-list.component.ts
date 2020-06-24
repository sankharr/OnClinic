import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-doctors-list',
  templateUrl: './doctors-list.component.html',
  styleUrls: ['./doctors-list.component.css']
})
export class DoctorsListComponent implements OnInit {

  items : any;

  constructor(
    public auth:AuthService,
    private db:AngularFirestore
    ) { }

  ngOnInit(): void {
    this.db.collection("Users",(ref)=>(ref.where("role","==","doctor"))).snapshotChanges()
    .subscribe(result=>{
      this.items=result;
      console.log(this.items);
    })
  }

}
