import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-patients',
  templateUrl: './patients.component.html',
  styleUrls: ['./patients.component.css']
})
export class PatientsComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  openSidebar() {
    (<HTMLInputElement>document.getElementById("sidebar")).style.display = "inline";
    // document.getElementById("sidebar").style.display = "inline";
    // document.getElementById("main").style.marginLeft = "250px";
  }

  

}
