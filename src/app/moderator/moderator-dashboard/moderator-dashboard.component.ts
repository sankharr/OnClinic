import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as _ from 'lodash'
import { ModeratorService } from 'src/app/services/moderator.service';
import { element } from 'protractor';
import { result, forEach } from 'lodash';
import * as customjs from '../../../assets/js/app.js'
import { async } from '@angular/core/testing';
import { firestore } from 'firebase';
import { AngularFirestore } from '@angular/fire/firestore';
declare var MeasureConnectionSpeed: any

@Component({
  selector: 'app-moderator-dashboard',
  templateUrl: './moderator-dashboard.component.html',
  styleUrls: ['./moderator-dashboard.component.scss']
})
export class ModeratorDashboardComponent implements OnInit {
  categories: any[];
  services: any[];
  cities: any[];
  selected: number;
  @ViewChild('chart') el: ElementRef;
  usersData: unknown[];
  patients: Pick<any, string | number | symbol>[];
  doctors: Pick<any, string | number | symbol>[];
  doctorData: unknown[];
  patientData: unknown[];
  query: any;
  state: any;
  test: firestore.DocumentData[];
  unregisteredDoctors: unknown[];
  constructor(private moderatorService: ModeratorService, private db: AngularFirestore) {
    var today = new Date();
  }

  async ngOnInit(): Promise<void> {
    // this.baseChart()
    const getdoctorsData = this.moderatorService.getAllUsers().subscribe(async (res) => {
      this.usersData = res;
      this.moderatorService.getDoctor().subscribe(async (doctorsData) => {
        // this.doctorData = doctorsData;
        this.moderatorService.getpatients().subscribe(async (patientData) => {
          this.moderatorService.getUnregDoctors().subscribe(unregdoc => {
            // console.log("getUnregDoctors",unregdoc);
            this.unregisteredDoctors = unregdoc;
            console.log(this.unregisteredDoctors)
            this.moderatorService.getThismonthUsers_d().subscribe(thismonthusers_d => {
              console.log("thismonthusers_d", thismonthusers_d);
              // this.getlastmonthDoctors(thismonthusers_d);
              this.moderatorService.getThismonthUsers_p().subscribe(thismonthusers_p => {
                // this.getlastmonthPatients(thismonthusers_p);
                this.moderatorService.getLastmonthPatient().subscribe(pastmontUsers_p=>{
                  this.moderatorService.getLastmonthDoctors().subscribe(pastmontUsers_d=>{
                    this.chartbyMonth(thismonthusers_p, thismonthusers_d, patientData,doctorsData,pastmontUsers_d,pastmontUsers_p);
                    this.piechart(doctorsData,patientData,unregdoc);
                    // console.log("past doc,this docs");
                    // console.log(pastmontUsers_d,thismonthusers_d);
                    // console.log("past pat,this pat");
                    // console.log(pastmontUsers_p,thismonthusers_p)
                  })
                })
              })
            })
          })
          // this.patientData = patientData;
        });
      });
    });
  }

  chartbyMonth(thismonthusers_p, thismonthusers_d,pathentsData, doctorsData,pastmontUsers_d,pastmontUsers_p) {
    var data = [
      {
        type: "indicator",
        mode: "number+delta",
        title: { text: "Patient Accounts" },
        delta: { reference: (pathentsData?.length-thismonthusers_p?.length) },
        value: pathentsData?.length,
        domain: { row: 0, column: 0 }
      },
      {
        type: "indicator",
        mode: "number+delta",
        value: thismonthusers_p?.length,
        title: {
          text:
            "<span style='font-size:0.8em;color:gray'>New Accounts for <br>this month</span>"
        },
        delta: { reference: pastmontUsers_p?.length, relative: true },
        domain: { row: 1, column: 0 }
      },
      {
        type: "indicator",
        title: { text: "Doctor Accounts" },
        mode: "number+delta",
        delta: { reference: (doctorsData?.length-thismonthusers_d?.length) },
        value: doctorsData?.length,
        domain: { row: 0, column: 1 }
      },
      {
        type: "indicator",
        mode: "number+delta",
        value: thismonthusers_d?.length,
        title: {
          text:
            "<span style='font-size:0.8em;color:gray'>New Accounts for <br>this month</span>"
        },
        delta: { reference: pastmontUsers_d?.length, relative: true },
        domain: { row: 1, column: 1 },
      }
    ];

    var layout = {
      width: 800,
      height: 400,
      margin: { t: 30, b: 25, l: 25, r: 25 },
      grid: { rows: 2, columns: 2, pattern: "independent" },
      template: {
        data: {
          indicator: [
            {
              mode: "number+delta+gauge",
            }
          ]
        }
      }
    };

    Plotly.newPlot('myDiv', data, layout);
  }

  piechart(doctorsData,patientData,unregdoc){
    var data = [{
      values: [(doctorsData?.length)-unregdoc?.length, patientData?.length, unregdoc?.length],
      labels: ['Doctors', 'Patient', 'Pending Doctors'],
      domain: {column: 0},
      name: 'HospitalCore Users',
      hoverinfo: 'label+percent+name',
      hole: .4,
      type: 'pie'
    }];
    
    var layout = {
      title: "<span style='font-size:2em;color:gray'>All Accounts<br></span>",
      annotations: [
        {
          font: {
            size: 20
          },
          showarrow: false,
          text: 'ALL USERS',
          x: 0.5,
          y: 0.5
        }
      ],
      height: 600,
      width: 600,
      showlegend: true,
      // grid: {rows: 1, columns: 2}
    };
    
    Plotly.newPlot('myDiv_pie', data, layout);
    
  }


  public buildServices() {
    this.services = [];
    this.categories.forEach((category) => {
      if (category.categoryId == this.selected) {
        this.services = category.categoryServicemodel;
      }
    });
  }

}
