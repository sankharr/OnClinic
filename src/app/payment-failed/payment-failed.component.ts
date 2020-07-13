import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-payment-failed',
  templateUrl: './payment-failed.component.html',
  styleUrls: ['./payment-failed.component.css']
})
export class PaymentFailedComponent implements OnInit {
  results: any;

  constructor(
    public auth: AuthService,
    private db: AngularFirestore
  ) {}

  ngOnInit(): void {
    this.db.collection('Users').doc(localStorage.getItem('uid')).valueChanges()
      .subscribe(output => {
        this.results = output;
        console.log("payment failed - ",this.results)
      })
  }

}