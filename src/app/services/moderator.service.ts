import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ModeratorService {

  constructor(
    private http: HttpClient,
    private db: AngularFirestore
  ) { }

  getAllUsers() {
    return this.db.collection("Users", (ref) => (ref.where("role", "in", ['doctor', 'patient']).limit(15))).valueChanges()
  }
  getDoctor() {
    return this.db.collection("Users", (ref) => (ref.where("role", "==", "doctor"))).valueChanges()
  }
  getpatients() {
    return this.db.collection("Users", (ref) => (ref.where("role", "==", "patient"))).valueChanges()
  }
  broadcast(data) {
    // http://localhost:5001/onclinic-dd11a/us-central1/broadcast/hello
    return this.http.post("https://us-central1-onclinic-dd11a.cloudfunctions.net/broadcast/hello", data)
  }
  getInquiries() {
    return this.db.collection('Inquries').valueChanges();
  }
  getUnregDoctors() {
    return this.db.collection("Users", (ref) => (ref.where("role", "==", "doctor").where("slmcVerified", "==", true).where("addressTokenVerified", '==', false))).valueChanges()
  }
  getBroadcasts() {
    return this.db.collection('broadcasts').valueChanges();
  }
  getThismonthUsers_d(){
    var datetime = new Date();
    var year = datetime.getFullYear()*10;
    var month = datetime.getMonth()+1;
    var accountCreation = year+month; 
    console.log(accountCreation)
    return this.db.collection("Users", (ref) => (ref.where("role", "==", "doctor")).where('accountcreation','==',accountCreation)).valueChanges()
  }
  getLastmonthDoctors(){
    var datetime = new Date();
    var year = datetime.getFullYear()*10;
    var month = datetime.getMonth();
    var accountCreation = year+month; 
    console.log(accountCreation)
    return this.db.collection("Users", (ref) => (ref.where("role", "==", "doctor")).where('accountcreation','==',accountCreation)).valueChanges()
  }
  getThismonthUsers_p(){
    var datetime = new Date();
    var year = datetime.getFullYear()*10;
    var month = datetime.getMonth()+1;
    var accountCreation = year+month; 
    console.log(accountCreation)
    return this.db.collection("Users", (ref) => (ref.where("role", "==", "patient")).where('accountcreation','==',accountCreation)).valueChanges()
  }
  getLastmonthPatient(){
    var datetime = new Date();
    var year = datetime.getFullYear()*10;
    var month = datetime.getMonth();
    var accountCreation = year+month; 
    console.log(accountCreation)
    return this.db.collection("Users", (ref) => (ref.where("role", "==", "patient")).where('accountcreation','==',accountCreation)).valueChanges()
  }
}

