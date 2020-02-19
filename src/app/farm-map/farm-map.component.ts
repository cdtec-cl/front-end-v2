import { Component, OnInit,ViewChild,ElementRef ,Inject  } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WiseconnService } from 'app/services/wiseconn.service';
import { element } from 'protractor';
import { NgbModal, NgbDate, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';

//graficas
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, BaseChartDirective, Label } from 'ng2-charts';
import * as pluginAnnotations from 'chartjs-plugin-annotation';

import Swal from 'sweetalert2'

import { WeatherService } from 'app/services/weather.service';


import * as Chartist from 'chartist';
import * as moment from "moment";
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-farm-map',
  templateUrl: './farm-map.component.html',
  styleUrls: ['./farm-map.component.scss']
})
export class FarmMapComponent implements OnInit {
  @ViewChild('mapRef', { static: true }) mapElement: ElementRef;
  private google_api_key = 'AIzaSyDx_dMfo0VnR_2CsF_wNw9Ayjd_HO6sMB0';
  public loading = false;
  public id = 0;
  public url;
  public mediciones;
  public selected;
  public dialog;
  today = Date.now();
  dataFarm: any;
  public zones: any[] = [];
  public weatherZones: any[] = [];
  public weatherStation: any = null;
  closeResult: string;
  clima: any;

  //rango de fechas para graficas
  public fromDate: NgbDate;
  public toDate: NgbDate;
  public dateRange: any = null;
  //graficas
  @ViewChild(BaseChartDirective, { static: true }) chart: BaseChartDirective;
  public lineChartData: ChartDataSets[] = [
    { data: [], label: 'Temperatura' },
    { data: [], label: 'Humedad', yAxisID: 'y-axis-1' },
  ];
  public lineChartLabels: Label[] = [];
  public lineChartOptions: (ChartOptions & { annotation: any }) = {
    responsive: true,
    scales: {
      // We use this empty structure as a placeholder for dynamic theming.
      xAxes: [{}],
      yAxes: [
        {
          id: 'y-axis-0',
          position: 'left',
        },
        {
          id: 'y-axis-1',
          position: 'right',
          gridLines: {
            color: 'rgba(255,0,0,0.3)',
          },
          ticks: {
            fontColor: 'red',
          }
        }
      ]
    },
    annotation: {
      annotations: [{}],
    },
    elements: {
        point: {
            radius: 0
        }
    }
  };
  public lineChartColors: Color[] = [
    { // red
      backgroundColor:'rgba(255, 255, 255, 0.1)',
      borderColor:'rgba(255, 0, 0,1)',
      pointBackgroundColor:'rgba(255, 0, 0,1)',
      pointBorderColor:'#fff',
      pointHoverBackgroundColor:'#fff',
      pointHoverBorderColor: 'rgba(255, 0, 0,0.8)'
    },
    { // blue
      backgroundColor:'rgba(255, 255, 255, 0.1)',
      borderColor:'rgba(2,87,154,1)',
      pointBackgroundColor:'rgba(2, 87, 154,1)',
      pointBorderColor:'#fff',
      pointHoverBackgroundColor:'#fff',
      pointHoverBorderColor:'rgba(2,87,154,0.8)'
    }
  ];
  public lineChartLegend = true;
  public lineChartType = 'line';
  public lineChartPlugins = [pluginAnnotations];


  public temperatureId: number = null;
  public humidityId: number = null;
  public renderLineChartFlag : boolean = false;

  //bar chart
  barChartOptions: ChartOptions = {
    responsive: true,
    // We use these empty structures as placeholders for dynamic theming.
    scales: { xAxes: [{}], yAxes: [{}] },
    plugins: {
      datalabels: {
        anchor: 'end',
        align: 'end',
      }
    }
  };
  barChartLabels: Label[] = [];
  barChartType: ChartType = 'bar';
  barChartLegend = true;
  barChartPlugins = [];

  barChartData: ChartDataSets[] = [
  { data: [], label: 'Rainfall (mm)' },
  { data: [], label: 'Et0 (mm)' }
  ];
  rainId: number = null;
  et0Id: number = null;
  renderBarChartFlag: boolean = false;
  farms:any=[];

  //Pronostico values
  climaLoading = false;
  climaToday: any;
  climaDay = [];
  climaIcon = [];
  climaMax = [];
  climaMin = [];

  constructor(
    private _route: ActivatedRoute,
    private wiseconnService: WiseconnService,
    public modalService: NgbModal,
    private router: Router,
    public weatherService: WeatherService,
    private calendar: NgbCalendar,
    private dialogs: MatDialog) {
  }

  ngOnInit() {
    this.init(0);

  }
  init(id) {
    this.renderLineChartFlag=false;
    this.getFarms();

    //rango de fechas para graficas
    this.fromDate = this.calendar.getNext(this.calendar.getToday(), 'd', -5);
    this.toDate = this.calendar.getToday();
    this.dateRange = {
      initTime: moment(this.fromDate.year + "-" + this.fromDate.month + "-" + this.fromDate.day).format("YYYY-MM-DD"),
      endTime: moment(this.toDate.year + "-" + this.toDate.month + "-" + this.toDate.day).format("YYYY-MM-DD")
    };
    let idFarm;
    if (id == 0) {
      idFarm = (this._route.snapshot.paramMap.get('id'));
      this.getZones(this._route.snapshot.paramMap.get('id'));
    } else {
      idFarm = id;
      this.getZones(id);
    }
    this.climaLoading = false;
    this.wiseconnService.getFarm(idFarm).subscribe((data) => {
      this.dataFarm = data;
      this.selected = data.name;
      this.weatherService;
      const q = [data.latitude, data.longitude];
      if (q[0] != null) {
        const key = "67a49d3ba5904bef87441658192312";
        this.weatherService.getWeather(key, q).subscribe((weather) => {
          this.climaDay = [];
          this.climaIcon = [];
          this.climaMax = [];
          this.climaMin = [];
          this.climaToday = weather.data.current_condition[0];
          var clima = (weather.data.weather);
          for (const data of clima) {
            data.iconLabel = data.hourly[0].weatherIconUrl[0];
            this.climaDay.push(data.date);
            this.climaIcon.push(data.iconLabel.value);
            this.climaMax.push(data.maxtempC);
            this.climaMin.push(data.mintempC);
          }
          this.climaLoading = true;
        });
      }
      switch (data.name) {
        case "Agrifrut":
          this.url = "https://cdtec.irrimaxlive.com/?cmd=signin&username=cdtec&password=l01yliEl7H#/u:3435/Campos:l/Agrifrut:f";
          break;
        case "Agrifrut II (Nogales y Parrones)":
          this.url = "https://cdtec.irrimaxlive.com/?cmd=signin&username=cdtec&password=l01yliEl7H#/u:3435/Campos:l/Agrifrut%20II%20(Nogales%20y%20Parrones):f";
          break;
        case "Santa Juana de Chincolco":
          this.url = "https://cdtec.irrimaxlive.com/?cmd=signin&username=cdtec&password=l01yliEl7H#/u:3507/Campos:l/Agricola%20Santa%20Juana%20de%20Chincolco%20SA:f";
          break;
        default:
          this.url = "";
      }
    });
  }
  getZones(id: any) {
    this.loading = true;
    this.wiseconnService.getZones(id).subscribe((data: any) => {
      this.zones = data;
      this.weatherZones = data.filter((element)=>{
        if(element.type.find((element) => {
            return element === 'Weather';
          }) != undefined){
          return element
        }
      });
      this.loading = false;
      for (var i = this.zones.length - 1; i >= 0; i--) {
        if (this.zones[i].name == "Estación Meteorológica" || this.zones[i].name == "Estación Metereológica") {
          this.weatherStation = this.zones[i];
          this.loading = true;
          this.wiseconnService.getMeasuresOfZones(this.weatherStation.id).subscribe((data) => {
            for (var i = data.length - 1; i >= 0; i--) {
              //bar chart
              if (data[i].sensorType === "Rain") {
                this.rainId = data[i].id;
              }
              if (data[i].name.toLowerCase() === "et0") {
                this.et0Id = data[i].id;
              }
              if(this.rainId&&this.et0Id){
                this.wiseconnService.getDataByMeasure(this.rainId,this.dateRange).subscribe((data) => {
                  let rainData=data;
                  console.log("rainData:",rainData);
                  this.wiseconnService.getDataByMeasure(this.et0Id,this.dateRange).subscribe((data) => {
                    let et0Data=data;
                    console.log("et0Data:",et0Data);
                    this.loading = false;
                    rainData=rainData.map((element)=>{
                      element.chart="rain";
                      return element
                    })
                    et0Data=et0Data.map((element)=>{
                      element.chart="et0";
                      return element;
                    })
                    let chartData=rainData.concat(et0Data);
                    chartData.sort(function (a, b) {
                      if (moment(a.time).isAfter(b.time)) {
                        return 1;
                      }
                      if (!moment(a.time).isAfter(b.time)) {
                        return -1;
                      }
                      // a must be equal to b
                      return 0;
                    });
                    console.log("chartData:",chartData)
                    this.resetChartsValues("bar");
                    for (var i = 0; i < chartData.length; i++) {
                      if(chartData[i+1]){
                        if(chartData[i].time===chartData[i+1].time){
                          this.barChartLabels.push(chartData[i].time);                    
                        }  
                      }                  
                      if(chartData[i].chart=="rain") {
                        this.barChartData[0].data.push(chartData[i].value);
                      }
                      if(chartData[i].chart=="et0") {
                        this.barChartData[1].data.push(chartData[i].value);
                      }                  
                      this.renderCharts("bar");
                    }
                  });
                });
              }
              //line chart
              if (data[i].sensorType === "Temperature") {
                this.temperatureId = data[i].id;
              }
              if (data[i].sensorType === "Humidity") {
                this.humidityId = data[i].id;
              }
              if(this.temperatureId&&this.humidityId){
                this.wiseconnService.getDataByMeasure(this.temperatureId,this.dateRange).subscribe((data) => {
                  let temperatureData=data;
                  this.wiseconnService.getDataByMeasure(this.humidityId,this.dateRange).subscribe((data) => {
                    let humidityData=data;
                    this.loading = false;
                    temperatureData=temperatureData.map((element)=>{
                      element.chart="temperature";
                      return element
                    })
                    humidityData=humidityData.map((element)=>{
                      element.chart="humidity";
                      return element
                    })
                    let chartData=temperatureData.concat(humidityData);
                    chartData.sort(function (a, b) {
                      if (moment(a.time).isAfter(b.time)) {
                        return 1;
                      }
                      if (!moment(a.time).isAfter(b.time)) {
                        return -1;
                      }
                      // a must be equal to b
                      return 0;
                    });
                    chartData = chartData.filter((element) => {
                      if(moment(element.time).minutes()==0 || moment(element.time).minutes()==30)
                        return element;
                    });
                    for (var i = 1; i < chartData.length; i+=2) {                      
                      if(this.lineChartLabels.find((element) => {
                        return element === chartData[i].time;//.format("YYYY-MM-DD hh:mm:ss");
                      }) === undefined) {
                        this.lineChartLabels.push(chartData[i].time);
                      }
                      if (chartData[i].chart==="temperature") {
                        this.lineChartData[0].data.push(chartData[i].value);
                      } 
                      if(chartData[i-1].chart==="humidity"){
                        this.lineChartData[1].data.push(chartData[i-1].value);
                      }
                        this.renderCharts("line");
                    }
                  });
                });
              }else if(i==0){
                Swal.fire({
                  icon: 'info',
                  title: 'Oops...',
                  text: 'No tiene configurado los sensores de humedad y temperatura'
                })
              }
            }
          });
        }
      }
      if (data.length == 0) {
        this.loadMap([]);
        this.mediciones = [];
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Por favor revisar la data cargada en el campo, ya que no tiene data cargada!'
        })
      } else {

         if (data[0].max != null) {
           this.loadMap(data);
         } else {
           this.loadMap([]);
           this.mediciones = [];
           Swal.fire({
             icon: 'error',
             title: 'Oops...',
             text: 'Por favor revisar la data cargada en el campo, ya que presenta errores, (ubicaciones no cargada, falta data etc) !'
           })
         }
      }
    });
  }
  getFarms() {
    this.wiseconnService.getFarms().subscribe((data: any) => {
      this.farms = data;
      switch (localStorage.getItem("username").toLowerCase()) {
        case "agrifrut":
          this.farms = this.farms.filter((element) => {
            return element.id == 185 || element.id == 2110 || element.id == 1378 || element.id == 520
          })
          break;
        case "santajuana":
          this.farms = this.farms.filter((element) => {
            return element.id == 719
          })
          break;

        default:
          // code...
          break;
      }
    })
  }
  renderCharts(chart:string) {
    switch (chart) {
      case "line":
        this.renderLineChartFlag=true;
        break;
      case "bar":
        this.renderBarChartFlag=true;
        break;
      default:
        // code...
        break;
    }
  }
  renderMap() {

    window['initMap'] = () => {
      this.loadMap(null);
    }
    if (!window.document.getElementById('google-map-script')) {
    } else {
      this.loadMap(null);
    }
  }
  loadMap = (data) => {
    if (data.length == 0) {
      var map = new window['google'].maps.Map(this.mapElement.nativeElement, {
        center: { lat: -32.89963602180464, lng: -70.90243510967417 },
        zoom: 15,
        mapTypeId: window['google'].maps.MapTypeId.HYBRID
      });
    } else {

      var map = new window['google'].maps.Map(this.mapElement.nativeElement, {
        center: { lat: data[10].polygon.path[0].lat, lng: data[10].polygon.path[0].lng },
        zoom: 15,
        mapTypeId: window['google'].maps.MapTypeId.HYBRID
      });
    }

    //Funcion de Click
    var wisservice = this.wiseconnService;
    var redirect = this.router;
    var zones = this.zones;
      

    let tooltip = document.createElement("span");
    var addListenersOnPolygon = function (polygon, id) {
    let map = document.getElementById("map-container")?document.getElementById("map-container").firstChild:null;
    if(map){
      let zone = zones.filter(element => element.id == id)[0];
      window['google'].maps.event.addListener(polygon, 'mouseover', (event) => {        
        tooltip.id = 'tooltip-text';
        tooltip.style.backgroundColor = '#777777';
        tooltip.style.color = '#FFFFFF';
        tooltip.innerHTML = zone.name;
        tooltip.style.position = 'absolute';
        tooltip.style.padding = '20px 20px';
        tooltip.style.bottom = '0px';
        // tooltip.style.left = event.tb.offsetX + 'px';
        // tooltip.style.top = event.tb.offsetY + 'px';
        map.appendChild(tooltip);
      });
      window['google'].maps.event.addListener(polygon, 'mouseout', (event) => {
        var elem = document.querySelector('#tooltip-text');
        elem.parentNode.removeChild(elem);
      });
      window['google'].maps.event.addListener(polygon, 'click', () => {        
        wisservice.getMeasuresOfZones(id).subscribe((data: any) => {
          wisservice.getIrrigarionsRealOfZones(id).subscribe((dataIrrigations: any) => {
            redirect.navigate(['/farmpolygon', data[0].farmId, id]);
          })
        });
      });
    }
      
    }

    // var marker = new window['google'].maps.Marker({
    //   position: {lat: -32.232403, lng: -70.827825},
    //   map: map,
    //   title: 'Hello World!',
    //   draggable: true,
    //   animation: window['google'].maps.Animation.DROP,
    // });

    var contentString = '<div id="content">' +
      '<div id="siteNotice">' +
      '</div>' +
      '<h3 id="thirdHeading" class="thirdHeading">W3path.com</h3>' +
      '<div id="bodyContent">' +
      '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>' +
      '</div>' +
      '</div>';

    var flightPlanCoordinates = [
      { lat: -32.90045576247285, lng: -70.90006940132304 },
    ];
    var flightPath = new window['google'].maps.Polyline({
      path: flightPlanCoordinates,
      geodesic: true,
      strokeColor: '#FF0000',
      strokeOpacity: 1.0,
      strokeWeight: 2
    });

    flightPath.setMap(map);
    var infowindow = new window['google'].maps.InfoWindow({
      content: contentString
    });

    // marker.addListener('click', function() {
    //   infowindow.open(map, marker);
    // });
    data.forEach(element => {
      // Construct the polygon.
      wisservice.getIrrigarionsRealOfZones(element.id).subscribe((dataIrrigations: {}) => {
        if (element.id == "727" || element.id == 727 || element.id == "6054" || element.id == 6054 || element.id == "13872" || element.id == 13872) {
          var Triangle = new window['google'].maps.Polygon({
            paths: element.polygon.path,
            strokeColor: '#E5C720',
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: '#E5C720',
            fillOpacity: 0.35,
          });
          Triangle.setMap(map);
          addListenersOnPolygon(Triangle, element.id);
          this.loading = true;
          wisservice.getMeterogoAgrifut(element.id).subscribe((data: any) => {
            this.loading = false;
            this.mediciones = data;
            for (const item of this.mediciones) {
                if(item.name == "Velocidad Viento"){
                  item.name = "Vel. Viento"
                }
                if(item.name == "Direccion de viento") {
                  item.name = "Dir. Viento"
                }
                if(item.name == "Radiacion Solar"){
                  item.name = "Rad. Solar"
                }   
                if(item.name == "Station Relative Humidity"){
                  item.name = " Sta. Rel. Humidity "
                }  
                if(item.name == "Wind Direction" || item.name ==  "ATM pressure" || item.name ==  "Wind Speed (period)" || item.name ==  "Porciones de Frío" || item.name ==  "Horas Frío"){
                  this.deleteValueJson(item.name);
                }    
                if(item.name == "Porciones de Frío")  {
                  this.deleteValueJson(item.name);
                }
                if(item.name == "Horas Frío")  {
                  this.deleteValueJson(item.name);
                }    
            }
            this.deleteValueJson("Et0");
            this.deleteValueJson("Etp");
          });
        } else {
          if (dataIrrigations != "") {
            if (dataIrrigations[0].status == "Executed OK") {
              var Triangle = new window['google'].maps.Polygon({
                paths: element.polygon.path,
                strokeColor: '#49AA4F',
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: '#49AA4F',
                fillOpacity: 0.35,
              });
              Triangle.setMap(map);
              addListenersOnPolygon(Triangle, element.id);
            } else {
              if (dataIrrigations[0].status == "Running") {
                var Triangle = new window['google'].maps.Polygon({
                  paths: element.polygon.path,
                  strokeColor: '#419FD5',
                  strokeOpacity: 0.8,
                  strokeWeight: 2,
                  fillColor: '#419FD5',
                  fillOpacity: 0.35,
                });
                Triangle.setMap(map);
                addListenersOnPolygon(Triangle, element.id);
              } else {
                var Triangle = new window['google'].maps.Polygon({
                  paths: element.polygon.path,
                  strokeColor: '#FF0000',
                  strokeOpacity: 0.8,
                  strokeWeight: 2,
                  fillColor: '#FF0000',
                  fillOpacity: 0.35,
                });
                Triangle.setMap(map);
                addListenersOnPolygon(Triangle, element.id);
                //  var map2 = new window['google'].maps.Map(this.mapElement.nativeElement, {          
                //     center: {lat: element.polygon.path[0].lat, lng: element.polygon.path[0].lng},
                //     zoom:15
                //   });
              }
            }
          }
        }
      });


    });
  }
  resetChartsValues(chart:string){
    switch (chart) {
      case "line":
        this.lineChartLabels=[];
        this.lineChartData[0].data=[];
        this.lineChartData[1].data=[];
        break;  
      case "bar":
        this.barChartLabels=[];
        this.barChartData[0].data=[];
        this.barChartData[1].data=[];
        break;
      default:
        // code...
        break;
    }
  }
  deleteValueJson(value) {
    var index: number = this.mediciones.indexOf(this.mediciones.find(x => x.name == value));
    if (index != -1) this.mediciones.splice(index, 1);
  }
  obtenerMedidas(id) {
    this.wiseconnService.getMeasuresOfZones(this.id).subscribe((data: {}) => {
    })
  }
  open(content, sizeValue) {
    this.modalService.open(content, {size: sizeValue} );
  }
  onSelect(select: string, id: number) {
    let redirect = this.router;
    let wisservice = this.wiseconnService;

    switch (select) {
      case "farm":
        redirect.navigate(['/farmmap', id]);
        this.init(id);
        break;
      case "zone":
        wisservice.getMeasuresOfZones(id).subscribe((data: any) => {
          wisservice.getIrrigarionsRealOfZones(id).subscribe((dataIrrigations: any) => {
            redirect.navigate(['/farmpolygon', data[0].farmId, id]);
          })
        });
        break;
      default:
        // code...
        break;
    }
  }
  openDialog(): void {
     const dialogRef = this.dialogs.open(DialogMessage, {
       panelClass: 'messagedialogcss'
     });
  }
  formatDate(date:string){
    let formatDate;
    if(date.indexOf("Mon")==0){
      formatDate=date.replace('Mon', 'Lun')
    }
    if(date.indexOf("Tue")==0){
      formatDate=date.replace('Tue', 'Mar')
    }
    if(date.indexOf("Wed")==0){
      formatDate=date.replace('Wed', 'Mie')
    }
    if(date.indexOf("Thu")==0){
      formatDate=date.replace('Thu', 'Jue')
    }
    if(date.indexOf("Fri")==0){
      formatDate=date.replace('Fri', 'Vie')
    }
    if(date.indexOf("Sat")==0){
      formatDate=date.replace('Sat', 'Sab')
    }
    if(date.indexOf("Sun")==0){
      formatDate=date.replace('Sun', 'Dom')
    }
    return formatDate;
  }
   
}

@Component({
  selector: 'message-dialog',
  templateUrl: 'message-dialog.html',
  styleUrls: ['./message-dialog.scss'],
})
export class DialogMessage {

  constructor(
    public dialogRef: MatDialogRef<DialogMessage>,
    // @Inject(MAT_DIALOG_DATA) public data 
    ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}