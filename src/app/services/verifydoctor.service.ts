import {HttpClient} from '@angular/common/http'
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
// import { AngularFireDatabase, AngularFireList } from '@angular/fire/database'
// import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class VerifydoctorService {

  constructor(
    private db: AngularFirestore,
    private http: HttpClient,
    // private db:AngularFirestore
  ) { }

  verifyDoctor(id,data){ 
    // console.log("At service")
    console.log(id,data)
    return this.http.post('api/doctor_verification',[data,id])
  }
  sendEmail(id,data){
    return this.http.post('api/email',[data,id])
  }
  verifyEmail(id,code){
    return this.http.post('api/emailverify',[id,code])  
  }
  sendPhoneOtp(id,otp){
     return this.http.post('api/phoneotp',[id,otp])
  }
// https://onclinic-test.herokuapp.com/api check server status:
  sendOtpText(message,phoneNumber){
    return this.http.post('api/sendtextmessage',[message,phoneNumber])
  }

  verifyphone(id,x){
    this.db.collection("Users").doc(id).update({
      PhoneNumberVerified:x
    })
    // return this.http.post('api/phoneverify',[id,otp])
  }
  sendToken(uid,token,name,address){
    this.db.collection("Users").doc(uid).update({
      addressToken:token,
      addressTokenVerified:false
  })
  return this.http.post('api/address',[name,token,address,uid])
  }
  verifyAddress(uid){
    this.db.collection("Users").doc(uid).update({
      addressTokenVerified:true,
    })
    console.log('addressTokenVerified');
  }

}

