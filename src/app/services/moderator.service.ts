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
    // http://localhost:5001/onclinic-dd11a/us-central1/broadcast/hello
    return this.http.post("https://us-central1-onclinic-dd11a.cloudfunctions.net/broadcast/hello",data)
  }
  getInquiries(){
    return this.db.collection('Inquries').valueChanges();
  }
  getBroadcasts(){
    return this.db.collection('broadcasts').valueChanges();
  }
}

