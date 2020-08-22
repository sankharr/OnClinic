import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { AngularFirestore } from '@angular/fire/firestore';
import * as mapboxgl from 'mapbox-gl';
import { environment } from "../../environments/environment";
import * as MapboxGeocoder from '@mapbox/point-geometry';

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {

  map: mapboxgl.Map;
  style = 'mapbox://styles/mapbox/streets-v11';
  lat = 80.44949;
  lng = 6.172652;
  zoom = 12

  coordinates: any;
  constructor(
    private http: HttpClient,
    private db: AngularFirestore
  ) { mapboxgl.accessToken = environment.mapbox.accessToken }

  // public getPosition(): Observable<Position> {
  //   return Observable.create(
  //     (observer) => {
  //       navigator.geolocation.watchPosition((pos: Position) => {
  //         observer.next(pos);
  //       }),
  //         () => {
  //           console.log('Position is not available');
  //         },
  //       {
  //         enableHighAccuracy: true
  //       };
  //     });
  // }

  addDisease(frm) {
    var lat: number = +frm.latitude
    var lng: number = +frm.longitude
    this.db.collection("diseases").add({
      class: frm.disease,
      name: frm.displayName,
      reclat: lat,
      reclong: lng,
      city:frm.city,
    });
  }

  getAlldesease(){
    return this.db.collection('diseases').valueChanges();
  }

  // buildMap() {
  //   mapboxgl.accessToken = 'pk.eyJ1IjoiaG9zcGl0YWxjb3JlIiwiYSI6ImNrYzBuOWJzZDBrdGQyc29lczc3NjNsZGgifQ.lOaMJP5AOSt4spWFz9XIoQ';
  //   var geocoder = new MapboxGeocoder({
  //   accessToken: mapboxgl.accessToken,
  //   types: 'country,region,place,postcode,locality,neighborhood'
  //   });

  //   geocoder.addTo('#map');
  // }

  getPosition(): Promise<any> {
    return new Promise((resolve, reject) => {

      navigator.geolocation.getCurrentPosition(resp => {
        resolve({ lng: resp.coords.longitude, lat: resp.coords.latitude,enableHighAccuracy: true });
      },
        err => {
          reject(err);
        });
    });

  }
}
