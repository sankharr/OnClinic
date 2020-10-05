import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ModeratorService {

  constructor(
    private http: HttpClient,
    private db:AngularFirestore
  ) { }

  getAllUsers(){
    return this.db.collection('Users').valueChanges();
  }
  getDoctor(doctorId){
    return this.db.collection("Users",(ref)=>(ref.where("email","==","saman@gmail.com"))).snapshotChanges()
  }
  broadcast(data){
    return this.http.post("https://us-central1-onclinic-dd11a.cloudfunctions.net/broadcast",data)
  }
  getInquiries(){
    return this.db.collection('Inquries').valueChanges();
  }
}

