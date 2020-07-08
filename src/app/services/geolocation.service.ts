import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {

  coordinates: any;
  constructor(
    private http: HttpClient,
    private db:AngularFirestore
  ) { }

  public getPosition(): Observable<Position> {
    return Observable.create(
      (observer) => {
      navigator.geolocation.watchPosition((pos: Position) => {
        observer.next(pos);
      }),
      () => {
          console.log('Position is not available');
      },
      {
        enableHighAccuracy: true
      };
    });
  }

  addDisease(frm){
    var lat: number = +frm.latitude
    var lng:number = +frm.longitude
    this.db.collection("diseases").add({
      class: frm.disease,
      name:frm.displayName,
      reclat:lat,
      reclong:lng      
  });
  }
}
