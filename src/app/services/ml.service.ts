import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database'
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class MlService {

  constructor(
    private db:AngularFirestore
  ) { }

  getUsers(){
    return this.db.collection('Symptoms').snapshotChanges();
  }

  searchUsers(searchValue){
    return this.db.collection('Symptoms',ref => ref.where('nameToSearch', '>=', searchValue)
      .where('nameToSearch', '<=', searchValue + '\uf8ff'))
      .snapshotChanges()
  }

  // getMovies(start, end): AngularFireList<any>{
  //   return this.db.list('/movies', {
  //     query: {
  //       orderByChild: 'Title',
  //       limitToFirst: 10,
  //       startAt: start,
  //       endAt: end
  //     }
  //   });
  // }
}
