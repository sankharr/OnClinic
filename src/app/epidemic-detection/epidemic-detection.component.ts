import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Variable } from '@angular/compiler/src/render3/r3_ast';
import { GeolocationService } from '../services/geolocation.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { FormGroup, FormControl } from '@angular/forms';
import * as firebase from 'firebase';

@Component({
  selector: 'app-epidemic-detection',
  templateUrl: './epidemic-detection.component.html',
  styleUrls: ['./epidemic-detection.component.css']
})
export class EpidemicDetectionComponent implements OnInit {
  myform: FormGroup;
  displayName: FormControl;
  @ViewChild('chart') el: ElementRef;
  pos: any
  location: any;
  lat: any;
  lon: any;
  mapboxAccessToken: string = "pk.eyJ1IjoiaG9zcGl0YWxjb3JlIiwiYSI6ImNrYzBuOWJzZDBrdGQyc29lczc3NjNsZGgifQ.lOaMJP5AOSt4spWFz9XIoQ"
  disease: FormControl;
  latitude: FormControl;
  longitude: FormControl;
  // lon: [
  //   80.242837,80.229747,80.419388
  // ],
  // lat: [
  //   6.386271,6.345327,6.847351
  // ]

  constructor(private geolocation: GeolocationService) {
    this.createFormControls();
    this.createForm();
  }
  coordinates;

  ngOnInit(): void {
    this.getMarker()
    // console.log(docs)
    this.drawMap()
  }

  async getMarker() {
    const snapshot = await firebase.firestore().collection('diseases').get()
    var data = snapshot.docs.map(doc => doc.data());

    this.specificMap(data)
    // console.log(data)
    // this.geolocation.sendReq(data).subscribe(res=>{
    //   console.log(res)
    // })

    // let csv = '';
    // let header = Object.keys(data[0]).join(',');
    // let values = data.map(o => Object.values(o).join(',')).join('\n');

    // csv += header + '\n' + values;
    // console.log(csv)
    // this.toCsv(data)

  }
  toCsv(data: any) {
    const replacer = (key, value) => value === null ? '' : value; // specify how you want to handle null values here
    const header = Object.keys(data[0]);
    let csv = data.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','));
    csv.unshift(header.join(','));
    let csvArray = csv.join('\r\n');
    // console.log(data['name'])
    // this.specificMap(data)

    // var blob = new Blob([csvArray], {type: 'charset=utf-8' })
    // saveAs(blob, "myFile.csv");
}

  createFormControls() {
    this.displayName = new FormControl('');
    this.disease = new FormControl('');
    this.latitude = new FormControl('');
    this.longitude = new FormControl('')
  }

  createForm() {
    this.myform = new FormGroup({
      displayName: this.displayName,
      disease: this.disease,
      latitude: this.latitude,
      longitude: this.longitude,

    });
  }

  addDisease(frm) {
    this.geolocation.addDisease(frm.value)
    // console.log("Successfully Inserted - ",frm.value);
  }

  drawMap() {

    var lon = [
      80.242837, 80.229747, 80.419388, 80.519388, 80.619388, 80.719388, 80.819388, 80.919388
    ]
    var lat = [
      6.386271, 6.345327, 6.847351, 6.847391, 6.848351, 6.947351, 6.840351, 6.847951
    ]


    var lon1 = [
      80.242836, 80.229748, 80.419389, 80.519388, 80.619380, 80.719380, 80.819384, 80.919384
    ]
    var lat1 = [
      6.386276, 6.345328, 6.847358, 6.847399, 6.848389, 6.947350, 6.840354, 6.847957
    ]

    var data1 = [
      { type: "scattermapbox", lon: lon, lat: lat, hoverinfo: "y", mode: 'markers', marker: { size: 20, color: 'rgb(99, 99, 250)', opacity: 0.5 } },
    ];

    var data = [
      { type: "scattermapbox", lon: lon1, lat: lat1, hoverinfo: "y", mode: 'markers', marker: { size: 20, color: 'rgb(0, 99, 250)' } },
      // { type: "scattermapbox", lon: lon, lat: lat, hoverinfo: "y",mode: 'markers',marker:{size:20,color:'rgb(99, 99, 250)',opacity:0.5}},
    ];

    // var data = [data1,data2]

    var layout = {
      title: 'Sri Lanka',
      mapbox: { style: "dark", zoom: 8, center: { lon: 80.669421, lat: 7.329778 } },
      margin: { t: 40, b: 0 }
    };

    var config = {
      mapboxAccessToken: this.mapboxAccessToken
    };

    Plotly.newPlot('chart', data, layout, config);
    // Plotly.newPlot('usa',data1,layout,config)
    // this.specificMap()
  }

  specificMap(rows) {
    // Plotly.d3.csv('../assets/csv/myFile.csv', function (err, rows) {

      var classArray = unpack(rows, 'class');
      var classes = [...new Set(classArray)];
      console.log(classes)

      function unpack(rows, key) {
        return rows.map(function (row) { return row[key]; });
      }

      var data = classes.map(function (classes) {
        var rowsFiltered = rows.filter(function (row) {
          return (row.class === classes);
        });
        console.log(rowsFiltered)
        return {
          type: 'scattermapbox',
          mode: 'markers', marker: { size: 25 },
          name: classes,
          lat: unpack(rowsFiltered, 'reclat'),
          lon: unpack(rowsFiltered, 'reclong')
        };
      });

      var layout = {
        title: 'Epidemic Detection',
        font: {
          color: 'white'
        },
        dragmode: 'zoom',
        // mode: 'markers', marker: { size: 20},
        mapbox: {
          center: {
            lat: 6.386271,
            lon: 80.242837
          },
          domain: {
            x: [0, 1],
            y: [0, 1]
          },
          style: 'dark',
          zoom: 10
        },
        margin: {
          r: 20,
          t: 40,
          b: 20,
          l: 20,
          pad: 0
        },
        paper_bgcolor: '#191A1A',
        plot_bgcolor: '#191A1A',
        showlegend: true,
        annotations: [{
          x: 0,
          y: 0,
          xref: 'paper',
          yref: 'paper',
          showarrow: true
        }]
      };

      Plotly.setPlotConfig({
        mapboxAccessToken: "pk.eyJ1IjoiaG9zcGl0YWxjb3JlIiwiYSI6ImNrYzBuOWJzZDBrdGQyc29lczc3NjNsZGgifQ.lOaMJP5AOSt4spWFz9XIoQ"
      });

      Plotly.newPlot('usa', data, layout);
    // });
  }
}




