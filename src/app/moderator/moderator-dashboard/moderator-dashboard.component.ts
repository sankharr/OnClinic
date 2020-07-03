import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import * as _ from 'lodash'
import { ModeratorService } from 'src/app/services/moderator.service';
import { element } from 'protractor';
import { result, forEach } from 'lodash';
import * as customjs from '../../../assets/js/app.js'
declare var MeasureConnectionSpeed: any

@Component({
  selector: 'app-moderator-dashboard',
  templateUrl: './moderator-dashboard.component.html',
  styleUrls: ['./moderator-dashboard.component.css']
})
export class ModeratorDashboardComponent implements OnInit {
  categories: any[];
  services: any[];
  cities: any[];
  selected: number;
  @ViewChild('chart') el: ElementRef;
  usersData: unknown[];
  constructor(private moderatorService: ModeratorService,) {
    this.categories = 
    [
      {
        "categoryId": 1,
        "categoryName": "Painting",
        "categoryDesc": "Painting of all types",
        "categoryServicemodel": [
          {
            "serviceId": 1,
            "serviceName": "Test12",
            "serviceDesc": "test12",
            "isActive": 1
          },
          {
            "serviceId": 3,
            "serviceName": "TESTINGEXAMPLE ",
            "serviceDesc": "TESTINGEXAMPLE Details Information",
            "isActive": 1
          },
          {
            "serviceId": 12,
            "serviceName": "New Painters",
            "serviceDesc": "office paintings ",
            "isActive": 2
          },
          {
            "serviceId": 11,
            "serviceName": "ABC Painters",
            "serviceDesc": "painting of all types",
            "isActive": 1
          }
        ],
        "active": 1
      },
      {
        "categoryId": 2,
        "categoryName": "string",
        "categoryDesc": "string",
        "categoryServicemodel": [
          {
            "serviceId": 2,
            "serviceName": "Test15",
            "serviceDesc": "test15",
            "isActive": 1
          }
        ],
        "active": 0
      },
      {
        "categoryId": 4,
        "categoryName": "carpenter",
        "categoryDesc": "Carpenter",
        "categoryServicemodel": [
          {
            "serviceId": 5,
            "serviceName": "Test Carpenter ",
            "serviceDesc": "Test carpenter Description",
            "isActive": 1
          }
        ],
        "active": 0
      }
    ]
   }

  ngOnInit(): void {
    // this.baseChart()
    this.moderatorService.getAllUsers().subscribe(res => {
      this.usersData = res;
      let usercount = this.usersData.length
      var result = Object.keys(res).map(function (key) {
        return [Number(key), res[key]];
      });
      this.baseChart(this.usersData)
    });
  }

  baseChart(userArray) {
    var element = this.el.nativeElement
    var grouped = _.mapValues(_.groupBy(userArray, 'role'),
      userlist => userlist.map(data => _.omit(data, 'role')));

    let doctors = grouped['doctor']
    let patients = grouped['patient']
    for (let index = 0; index < userArray.length; index++) {
      const element = userArray[index]['role'];

    }

    var data = [{
      values: [doctors.length, patients.length],
      labels: ['Doctors', 'Patients'],
      type: 'pie'
    }];


    var layout = {
      height: 400,
      width: 500
    };

    // Plotly.plot(element, data, style)
    Plotly.newPlot(element, data, layout);
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
