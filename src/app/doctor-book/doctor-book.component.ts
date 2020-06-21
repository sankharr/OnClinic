import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-doctor-book',
  templateUrl: './doctor-book.component.html',
  styleUrls: ['./doctor-book.component.css']
})
export class DoctorBookComponent implements OnInit {

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
