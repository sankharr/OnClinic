import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class FindSymptomsService {

  constructor(private http:HttpClient) { }

  get_symptoms(disease){
    console.log(typeof(disease))
    return this.http.post('api/disease',disease)
  }
}
