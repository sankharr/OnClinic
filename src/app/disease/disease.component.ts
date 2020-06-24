import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FindSymptomsService } from '../services/find-symptoms.service';

@Component({
  selector: 'app-disease',
  templateUrl: './disease.component.html',
  styleUrls: ['./disease.component.css']
})
export class DiseaseComponent implements OnInit {

  constructor(private http:HttpClient,
              private getSymService: FindSymptomsService            
    ) { }

  ngOnInit(): void {
  }

  get_symptoms(){
    //console.log('hiiii')
     const x = "hypertensive disease"
    // const symtoms = ["chest_pain","sweating","fatigue"]
    this.getSymService.get_symptoms(x).subscribe((res)=>{
      console.log(res)
    })
  }



}
