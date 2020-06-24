import {HttpClient} from '@angular/common/http'
import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/database'
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class MlService {

  constructor(
    private http: HttpClient,
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

  insertSymptom(formValue: any, str: string, str2: string) {
    return this.db.collection('Symptoms').add({
      displayName: formValue.displayName,
      symptom: str,
      nameToSearch: str2
    }).then(()=>{
      console.log("Successfully Inserted - ",formValue);
    })
    
  }
  get_prediction(symptoms){
    console.log(symptoms)
    return this.http.post('api/predict',symptoms)
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
