import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import * as _ from 'lodash';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-doctor-dashboard',
  templateUrl: './doctor-dashboard.component.html',
  styleUrls: ['./doctor-dashboard.component.css'],
})
export class DoctorDashboardComponent implements OnInit {
  @ViewChild('chart') el: ElementRef;
  @ViewChild('pieChart') el2: ElementRef;
  userId: any;
  result: any;
  result2: any;
  app: any;
  channellings: any;


  // +userid: string;

  constructor(private auth: AuthService, private db: AngularFirestore) {}

  ngOnInit(): void {

    this.userId = localStorage.getItem("uid");
    this.db
      .collection("Appointments")
      .valueChanges()
      .subscribe((output) => {
      this.result = output;
      this.test(this.result);
      this.charts();
     
      // console.log(this.result);
    
    })
    
       
  }
charts(){
  console.log("chart called")
  this.lineChart()
  this.pieChart()
}
  lineChart() {
    // const element = this.el.nativeElement;

    const data = [
      {
        x: ['7/1', '7/2', '7/3', '7/4', '7/5','7/6','7/7'],
        y: [10000, 15000, 16500, 9800, 11200, 13500, 9700],
      },
    ];

    const style = {
      margin: { t: 0 },
      title:'Daily Income',
      height: 240,
    
    };

    Plotly.newPlot("linechart", data, style);
  }

  pieChart(){
    // const element = this.el2.nativeElement;
    console.log("Pie chart")
    const data = [{
      values: [19, 26],
      labels: ['Treated', 'All'],
      type: 'pie'
    }];

    var layout = {
      height: 300,
      width: 320,
    
    };

    Plotly.newPlot("pie", data, layout);

  }

  test(data) {
    this.userId = localStorage.getItem("uid");
    this.db
      .collection("Users")
      .doc(this.userId)
      .valueChanges()
      .subscribe((res) => {
        // console.log(res)
        var doctorId = res["doctorID"];
        console.log(doctorId);
        this.result2 = res;
        
        var grouped = _.mapValues(_.groupBy(data, "doctorID"), (clist) =>
          clist.map((data) => _.omit(data, "doctorID"))
        );
        this.app = grouped[doctorId];
        console.log(this.app);
        
        var numOfChannelings =(this.app.length);
        console.log(numOfChannelings);
        this.channellings = numOfChannelings;

        // var ts = this.app["appointmentDate"];
        // console.log(ts);
        
      });
  }

}
