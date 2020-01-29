import { Component, OnInit,ViewChild,ElementRef   } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WiseconnService } from 'app/services/wiseconn.service';
import { element } from 'protractor';
import { NgbModal,ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { WeatherService } from 'app/services/weather.service';

@Component({
  selector: 'app-farm-map',
  templateUrl: './farm-map.component.html',
  styleUrls: ['./farm-map.component.scss'],
})
export class FarmMapComponent implements OnInit {
  @ViewChild('mapRef', {static: true }) mapElement: ElementRef;
  private google_api_key = 'AIzaSyDx_dMfo0VnR_2CsF_wNw9Ayjd_HO6sMB0';
  public loading = false;
  public id = 0;
  public url;
  public mediciones;
  closeResult: string;
  clima: any;
  
  constructor(private _route: ActivatedRoute,private wiseconnService: WiseconnService, public modalService: NgbModal,private router: Router, public weatherService: WeatherService) { }
  ngOnInit() {
    //this.renderMap();
    this.loading = true;
    this.wiseconnService.getZones(this._route.snapshot.paramMap.get('id')).subscribe((data: {}) => {      
      this.loading = false; 
      this.loadMap(data); 
    });
    let idFarm = (this._route.snapshot.paramMap.get('id'));
    this.wiseconnService.getFarm(idFarm).subscribe((data) => {
      console.log(data);
      this.weatherService;
      const q = [data.latitude, data.longitude];
      const key = "67a49d3ba5904bef87441658192312";
      console.log(q);
      this.weatherService.getWeather(key,q).subscribe((weather) => {
        this.clima = (weather.data.weather);
        // var clima2 = weather.data.current_condition[0];
        // this.climaRes.push({ name: 'temp_C' , value: clima2.temp_C });
        // this.climaRes.push({ name: 'temp_F' , value: clima2.temp_F });
        console.log(weather.data.weather);
      });
      
      //JLA: Esta funcion switch debe tomar los datos de configuraciones de IRRIMAXLIVE de forma dinñámica con rutas de cada cliente desde base de datos 
      console.log(data['account']['id']);
        switch (data['account']['id']) { 
          case 63:
            this.url="https://cdtec.irrimaxlive.com/?cmd=signin&username=cdtec&password=l01yliEl7H#/u:3435/Campos/Agrifrut";
            break;
          case 395:
            this.url="https://cdtec.irrimaxlive.com/?cmd=signin&username=cdtec&password=l01yliEl7H#/u:3507/Campos/Agricola%20Santa%20Juana%20de%20Chincolco";
            break;
          default:
            this.url="";
        } console.log(this.url);
    });
  }

  renderMap() {
    
    window['initMap'] = () => {
      this.loadMap(null);     
    }
    if(!window.document.getElementById('google-map-script')) {
    } else {
      this.loadMap(null);
    }
  }
  loadMap = (data) => {
    if(data.length == 0){
      var map = new window['google'].maps.Map(this.mapElement.nativeElement, {
        center: {lat: -32.89963602180464, lng: -70.90243510967417},
        zoom:15,
        mapTypeId: window['google'].maps.MapTypeId.HYBRID
      });
    }else{
      var map = new window['google'].maps.Map(this.mapElement.nativeElement, {
        center: {lat: data[10].polygon.path[0].lat, lng: data[10].polygon.path[0].lng},
        zoom:15,
        mapTypeId: window['google'].maps.MapTypeId.HYBRID
      });
    }
    
    //Funcion de Click
    var wisservice = this.wiseconnService;
    var redirect =  this.router;

    var addListenersOnPolygon = function(polygon,id) {
      //this.loading = true;

      window['google'].maps.event.addListener(polygon, 'click', () => {
     //   var ids = 0;

   //     this.ids = id;
    //   this.obtenerMedidas(id);
       wisservice.getMeasuresOfZones(id).subscribe((data: {}) => {     
       wisservice.getIrrigarionsRealOfZones(id).subscribe((dataIrrigations: {}) => {
          redirect.navigate(['/farmpolygon', data[0].farmId, id]);

        //     alert('ID Sector: '+id+'\nfarmId: '+data[0].farmId+ '\nESTATUS: '+dataIrrigations[0].status+
        //   '\nZone ID: '+data[0].zoneId+
        //   '\nName: '+data[0].name+' \nUnit: '+data[0].unit+ '\nLast Data: '+data[0].lastData+
        //   '\nLast Data Date: '+data[0].lastDataDate+'\nMonitoring Time: '+data[0].monitoringTime+
        //   '\nSenson Depth: '+data[0].sensorDepth+'\nDepth Unit: '+data[0].depthUnit+
        //   '\nNode ID: '+data[0].nodeId//'\nExpansion Port: '+data[0].physicalConnection.expansionPort+
        // // // '\nExpansionBoard: '+data[0].physicalConnection.expansionBoard+
        // //  //'\nNode Port: '+data[0].physicalConnection.nodePort+'\nSensor Type: '+data[0].sensorType
        //   );
     })
        });
      });  
    }
 
    // var marker = new window['google'].maps.Marker({
    //   position: {lat: -32.232403, lng: -70.827825},
    //   map: map,
    //   title: 'Hello World!',
    //   draggable: true,
    //   animation: window['google'].maps.Animation.DROP,
    // });
    
    var contentString = '<div id="content">'+
    '<div id="siteNotice">'+
    '</div>'+
    '<h3 id="thirdHeading" class="thirdHeading">W3path.com</h3>'+
    '<div id="bodyContent">'+
    '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>'+
    '</div>'+
    '</div>';

    var flightPlanCoordinates = [
      {lat: -32.90045576247285, lng: -70.90006940132304},
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
        //JLA: Por qué las condiciones tienen los IDs fijos, esto debe ser dinámico para cuando se tengan todos los clientes
        if(element.id == "727" || element.id== 727 || element.id == "6054" || element.id == 6054 || element.id == "13872" || element.id == 13872){
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
         wisservice.getMeterogoAgrifut(element.id).subscribe((data: {}) => { 
          this.loading = false;
              console.log(data);
           this.mediciones=data;   
         });
        }else{
        
        if(dataIrrigations[0].status == "Executed OK"){
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
        }else{
          if(dataIrrigations[0].status == "Running"){
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
          }else{
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
      });
      
      
    });
  }

  obtenerMedidas(id){
    this.wiseconnService.getMeasuresOfZones(this.id).subscribe((data: {}) => {      
    })
  }
  open(content) {
    this.modalService.open(content);
  }
}
