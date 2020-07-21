import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Variable } from '@angular/compiler/src/render3/r3_ast';
import { GeolocationService } from '../services/geolocation.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { FormGroup, FormControl } from '@angular/forms';
import * as firebase from 'firebase';
import * as MapboxGeocoder from '@mapbox/point-geometry';
import * as mapboxgl from 'mapbox-gl';
import * as _ from 'lodash';
import { group } from 'console';
import { AngularFirestore } from '@angular/fire/firestore';

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
  // values = [
  //   { id: 3432, name: "Recent" },
  //   { id: 3442, name: "Most Popular" },
  //   { id: 3352, name: "Rating" }
  // ];
  lat: any;
  lon: any;
  mapboxAccessToken: string = "pk.eyJ1IjoiaG9zcGl0YWxjb3JlIiwiYSI6ImNrYzBuOWJzZDBrdGQyc29lczc3NjNsZGgifQ.lOaMJP5AOSt4spWFz9XIoQ"
  disease: FormControl;
  latitude: FormControl;
  longitude: FormControl;
  city: FormControl;
  diseases_list: unknown[];
  city_count: number;
  disease_count: number;
  users_count: number;
  // grouped:any
  // lon: [
  //   80.242837,80.229747,80.419388
  // ],
  // lat: [
  //   6.386271,6.345327,6.847351
  // ]

  constructor(private geolocation: GeolocationService, public afs: AngularFirestore) {
    this.createFormControls();
    this.createForm();
  }
  coordinates;

  ngOnInit(): void {
    this.geolocation.getAlldesease().subscribe(res => {
      this.diseases_list = res;
      this.users_count = res.length;
      // console.log(res)
      var grouped_by_city = _.mapValues(_.groupBy(res, 'city'),
        userlist => userlist.map(data => _.omit(res, 'city')));
      console.log(grouped_by_city)
      var cities = _.keys(grouped_by_city)
      var disease_by_sity = _.values(grouped_by_city)
      // console.log(typeof(cities))
      this.city_count = cities.length
      this.pieChart(res);
    })
    // this.geolocation.buildMap()
    this.getMarker();
    // this.getLocation()
    // console.log(docs)
    // this.drawMap()
  }

  getPossition() {
    this.geolocation.getPosition().then(pos => {
      console.log(`Positon: ${pos.lng} ${pos.lat}`);
    })
  }

  pieChart(diseases) {
    var grouped = _.mapValues(_.groupBy(diseases, 'class'),
      clist => clist.map(data => _.omit(diseases, 'class')));
    var disease = _.keys(grouped)
    var disease_info = _.values(grouped)

    var data = [{
      values: [disease_info[0].length, disease_info[1].length, disease_info[2].length, disease_info[3].length, disease_info[4].length],
      labels: [disease[0], disease[1], disease[2], disease[3], 'other'],
      type: 'pie'
    }];

    var layout = {
      title: "Disease distribution by category",
      height: 600,
      width: 700
    };

    Plotly.newPlot('pieChart', data, layout);
  }

  async getMarker() {
    const snapshot = await firebase.firestore().collection('diseases').get()
    var data = snapshot.docs.map(doc => doc.data());
    // console.log(data)
    // console.log(data);
    var grouped = _.mapValues(_.groupBy(data, 'class'),
      clist => clist.map(data => _.omit(data, 'class')));
    // console.log(grouped)
    this.disease_count = _.keys(grouped).length
    var disease = _.keys(grouped)
    var disease_info = _.values(grouped)
    // for (let index = 0; index < data.length - 1; index++) {
    //   console.log(disease[index] + "==>" + disease_info[index].length)

    // }

    this.specificMap(data)
  }

  public async onChange(event) {  // event will give you full breif of action
    const newVal = event.target.value;
    console.log(newVal);
    // const snapshot = await firebase.firestore().collection('diseases').get()
    // var grouped = _.mapValues(_.groupBy(snapshot, 'class'),
    // clist => clist.map(data => _.omit(snapshot, 'class')));
    this.afs.collection('diseases').ref.where('city', '==',newVal).get().then((ref) => {

      let results = ref.docs.map(doc => doc.data());
      if (results.length > 0) {
        console.log(results); //do what you want with code
        this.specificMap_by_city(results);
      }
      // else {
      //   this.error(“no user);
      // }
    });

    // console.log(grouped)
    // this.geolocation.getAlldesease().subscribe(res=>{
    //   this.diseases_list = res
    //   console.log()
    // })


  }

  createFormControls() {
    this.displayName = new FormControl('');
    this.disease = new FormControl('');
    this.latitude = new FormControl('');
    this.longitude = new FormControl('');
    this.city = new FormControl('');
  }

  createForm() {
    this.myform = new FormGroup({
      displayName: this.displayName,
      disease: this.disease,
      latitude: this.latitude,
      longitude: this.longitude,
      city: this.city,

    });
  }

  addDisease(frm) {
    this.geolocation.addDisease(frm.value)
    // console.log("Successfully Inserted - ",frm.value);
  }



  specificMap(rows) {
    // Plotly.d3.csv('../assets/csv/myFile.csv', function (err, rows) {
    // console.log(rows)

    var classArray = unpack(rows, 'class');
    var classes = [...new Set(classArray)];
    // console.log(classes)

    function unpack(rows, key) {
      return rows.map(function (row) { return row[key]; });
    }

    var data = classes.map(function (classes) {
      var rowsFiltered = rows.filter(function (row) {
        return (row.class === classes);
      });
      // console.log(rowsFiltered)
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
          lon: 80.542837
        },
        domain: {
          x: [0, 1],
          y: [0, 1]
        },
        style: 'dark',
        zoom: 9
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
    // this.buildMap()
    // });
  }


  specificMap_by_city(rows) {
    // Plotly.d3.csv('../assets/csv/myFile.csv', function (err, rows) {
    // console.log(rows)

    var classArray = unpack(rows, 'class');
    var classes = [...new Set(classArray)];
    // console.log(classes)

    function unpack(rows, key) {
      return rows.map(function (row) { return row[key]; });
    }

    var data = classes.map(function (classes) {
      var rowsFiltered = rows.filter(function (row) {
        return (row.class === classes);
      });
      // console.log(rowsFiltered)
      return {
        type: 'scattermapbox',
        mode: 'markers', marker: { size: 25 },
        name: classes,
        lat: unpack(rowsFiltered, 'reclat'),
        lon: unpack(rowsFiltered, 'reclong')
      };
    });

    var layout = {
      title: `Recorded case count = ${rows.length}`,
      font: {
        color: 'white'
      },
      dragmode: 'zoom',
      // mode: 'markers', marker: { size: 20},
      mapbox: {
        center: {
          lat: 6.386271,
          lon: 80.542837
        },
        domain: {
          x: [0, 1],
          y: [0, 1]
        },
        style: 'dark',
        zoom: 9
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

    Plotly.newPlot('map_city', data, layout);
    // this.buildMap()
    // });
  }
  // buildMap() {
  //   var accessToken = 'pk.eyJ1IjoiaG9zcGl0YWxjb3JlIiwiYSI6ImNrYzBuOWJzZDBrdGQyc29lczc3NjNsZGgifQ.lOaMJP5AOSt4spWFz9XIoQ';
  //   var config = {mapboxAccessToken: accessToken};
  //   var data = new MapboxGeocoder({
  //   accessToken: accessToken,
  //   types: 'country,region,place,postcode,locality,neighborhood'
  //   });

  //   // geocoder.addTo('map');
  //   Plotly.newPlot('map', data, config);
  // }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.location = position.coords;
        console.log(position.coords);
      });
    }
  }



}




