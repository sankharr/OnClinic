import { Component, OnInit } from '@angular/core';
import { Subject, Observable, combineLatest } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { MlService } from '../services/ml.service';

@Component({
  selector: 'app-ml',
  templateUrl: './ml.component.html',
  styleUrls: ['./ml.component.css']
})
export class MlComponent implements OnInit {

  searchterm: string;
 
  startAt = new Subject();
  endAt = new Subject();
 
  clubs;
  allclubs;
 
  startobs = this.startAt.asObservable();
  endobs = this.endAt.asObservable();

  ageValue: number = 0;
  searchValue: string = "";
  items: Array<any>;
  name_filtered_items: Array<any>;
  age_filtered_items: Array<any>;

  constructor(
    private afs: AngularFirestore,
    private mlservice: MlService
    ) { }

  ngOnInit() {
    this.mlservice.getUsers()
    .subscribe(result => {
      this.items = result;
      this.age_filtered_items = result;
      this.name_filtered_items = result;
    })
    // this.getallclubs().subscribe((clubs) => {
    //   this.allclubs = clubs;
    // })
    // Observable.combineLatest(this.startobs, this.endobs).subscribe((value) => {
    //   this.firequery(value[0], value[1]).subscribe((clubs) => {
    //     this.clubs = clubs;
    //   })
    // })
  }

  searchByName() {
    let value = this.searchValue.toLowerCase();
    this.mlservice.searchUsers(value).subscribe(result => {
      // this.name_filtered_items = result;
      this.items = result;
      // this.items = this.combineLists(result, this.age_filtered_items);
    });
  }

  combineLists(a, b) {
    let result = [];

    a.filter(x => {
      return b.filter(x2 => {
        if (x2.payload.doc.id == x.payload.doc.id) {
          result.push(x2);
        }
      });
    });
    return result;
  }
  

  search($event) {
    let q = $event.target.value;
    if (q != '') {
      this.startAt.next(q);
      this.endAt.next(q + "\uf8ff");
    }
    else {
      this.clubs = this.allclubs;
    }
  }

  firequery(start, end) {
    return this.afs.collection('epl', ref => ref.limit(4).orderBy('club').startAt(start).endAt(end)).valueChanges();
  }
 
  getallclubs() {
    return this.afs.collection('epl', ref => ref.orderBy('club')).valueChanges();
  }

}
