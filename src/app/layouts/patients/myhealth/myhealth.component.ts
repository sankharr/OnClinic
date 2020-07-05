import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-myhealth',
  templateUrl: './myhealth.component.html',
  styleUrls: ['./myhealth.component.css']
})
export class MyhealthComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit(): void {
  }
  view() {
  }
}
