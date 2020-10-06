import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  patientsList: any[];
  patientsCount: number;
  doctorList: any[];
  doctorCount: number;
  moderatorList: unknown[];
  moderatorCount: number;
  totalRevenue: number;

  // @ViewChild("myDiv", { static: true })


  constructor(
    private db: AngularFirestore
  ) { }

  ngOnInit(): void {

    this.barChart();
    this.barChart2();

    this.db.collection('Users',ref => ref.where('role','==','patient')).valueChanges()
    .subscribe(output => {
      this.patientsList = output;
      this.patientsCount = this.patientsList.length;
    });

    this.db.collection('Users',ref => ref.where('role','==','doctor')).valueChanges()
    .subscribe(output => {
      this.doctorList = output;
      this.doctorCount = this.doctorList.length;
    });

    this.db.collection('Appointments').valueChanges()
    .subscribe(output => {
      this.moderatorList = output;
      this.moderatorCount = this.moderatorList.length;
      this.totalRevenue = 200*this.moderatorCount;
    });
  }
  barChart(){
    var data = [
      {
        x: ['July','August', 'September', 'October'],
        y: [3, 10, 7, 5],
        type: 'bar'
      }
    ];

    var layout = { 
      title: 'New User Registrations in recent months',
      font: {size: 18}
    };

    Plotly.newPlot('myDiv', data, layout, {staticPlot: true});
    console.log(data);
  }

  barChart2(){
    var data = [
      {
        x: ['June','July','August', 'September', 'October'],
        y: [200, 1000, 400, 600, 600],
        type: 'bar'
      }
    ];

    var layout = { 
      title: 'Revenue in recent months',
      font: {size: 18}
    };

    Plotly.newPlot('myDiv2', data, layout, {staticPlot: true});
    console.log(data);
  }
}
