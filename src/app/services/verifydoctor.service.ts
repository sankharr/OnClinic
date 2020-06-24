import {HttpClient} from '@angular/common/http'
import { Injectable } from '@angular/core';
// import { AngularFireDatabase, AngularFireList } from '@angular/fire/database'
// import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class VerifydoctorService {

  constructor(
    private http: HttpClient,
    // private db:AngularFirestore
  ) { }

  verifyDoctor(id,data){
    // console.log("At service")
    // console.log(id,data)
    return this.http.post('api/doctor_verification',[data,id])
  }
}
