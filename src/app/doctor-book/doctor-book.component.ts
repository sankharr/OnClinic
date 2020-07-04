import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-doctor-book',
  templateUrl: './doctor-book.component.html',
  styleUrls: ['./doctor-book.component.css']
})
export class DoctorBookComponent implements OnInit {

  document: any;
  id: any;
  data: any;
  private routeSub: Subscription;
  constructor(
    public auth: AuthService,
    private db: AngularFirestore,
    private route: ActivatedRoute
  ) {
  }

  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get("id");
  
    this.db.collection('Users').doc(this.id).ref.get().then((doc) => {
      this.data = doc.data();
      console.log(this.data);
    });

  
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
  }
  // getsingleUser() {
  //   this. id=this.route.snapshot.paramMap.get("id");
  //   console.log(this.id);

  //   this.document = this.db.collection('Users').doc('0O4B3NyshGUcWPZaGBhqLMSpIOd2').ref.get();
  //   console.log(this.document);
  //   return this.document.valueChanges();
  // }
}
