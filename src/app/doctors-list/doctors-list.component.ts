import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { getAllLifecycleHooks } from '@angular/compiler/src/lifecycle_reflector';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-doctors-list',
  templateUrl: './doctors-list.component.html',
  styleUrls: ['./doctors-list.component.css']
})
export class DoctorsListComponent implements OnInit {

  items: any;
  // doca: any;
  // doca1: any;

  doctorCategories = ["", "General Physician", "Family practice physician", "Pediatricians", "Allergists", "Dermatologists", "Infectious disease doctors", "Ophthalmologists", "Obstetrician/gynecologists", "Cardiologists", "Endocrinologists", "Gastroenterologists", "Nephrologists", "Urologists", "Pulmonologists", "Otolaryngologists", "Neurologists", "Psychiatrists", "Oncologists", "Radiologists", "Rheumatologists", "General surgeons", "Orthopedic surgeons", "Cardiac surgeons", "Anesthesiologists"];
  
  constructor(
    public auth: AuthService,
    private db: AngularFirestore
  ) { }

  viewDocId(id){
    localStorage.setItem("viewedDocId",id);

  }

  ngOnInit(): void {
    this.db.collection("Users", (ref) => (ref.where("role", "==", "doctor"))).snapshotChanges()
      .subscribe(result => {
        this.items = result;
        console.log(this.items);
      })


  }

sortByRatings(){
  this.items.sort((a,b) => (a.payload.doc.data().averageRating < b.payload.doc.data().averageRating)? 1 : -1 )
}

sortByAscending(){
  this.items.sort((a,b) => (a.payload.doc.data().name > b.payload.doc.data().name)? 1 : -1 )
}

sortByDescending(){
  this.items.sort((a,b) => (a.payload.doc.data().name < b.payload.doc.data().name)? 1 : -1 )
}
  toDoctorDates(uid){
    localStorage.setItem("selectedDocID",uid);
    //this.router.navigate('/doctor-book')
  }
  

}