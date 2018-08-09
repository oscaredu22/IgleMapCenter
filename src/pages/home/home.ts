import { Component, ViewChild, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { } from '@types/googlemaps';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild('gmap') gmapElement: any;
  map: google.maps.Map;
  miPosicion: google.maps.LatLng;
  miDestino: google.maps.LatLng;
  miMarcador: google.maps.Marker;
  marcadorDestino: google.maps.Marker;
  animationMarker: google.maps.InfoWindow;

  constructor(public navCtrl: NavController, private geolocation: Geolocation) {

  }

  ngOnInit() {
    this.startGoogleMap();
    this.escucharGPS();
  }

  startGoogleMap() {
    const mapProp = {
        center: new google.maps.LatLng(-0.2188964,-78.5138881), //??
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
    this.iniciarMarcadores();
  }

  obtenerMiPosicion() {
    this.geolocation.getCurrentPosition().then((resp) => {
      this.miPosicion = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
      this.actualizarMarcadorMio();
     }).catch((error) => {
       console.log(error);
     });
  }

  escucharGPS() {
    this.escuchando();
    setTimeout(() => {
      this.escucharGPS();
      }, 3000);
  }

  escuchando() {
    this.obtenerMiPosicion();
  }

  actualizarMarcadorMio() {
    this.miMarcador.setPosition(this.miPosicion);
  }

  iniciarMarcadores() {
    this.miMarcador = new google.maps.Marker({
      position: new google.maps.LatLng(-0.2188964,-78.5138881), //base de datos
      map: this.map,
      title: '',
      draggable: false,
      animation: google.maps.Animation.DROP 
    });

  //poner una informacion en el marcador
  var Map;   
  var info = new google.maps.InfoWindow({
    
    });

    this.miMarcador.addListener('click',function(){
      info.setContent('<h1>EJEMPLO</h1>'); 
        info.open(Map,this);
    });
    this.obtenerMiPosicion();
  }

  //dibujar ruta
  getRoute() {
    let directionsDisplay = new google.maps.DirectionsRenderer();
    directionsDisplay.setMap(this.map);
    let directionsService = new google.maps.DirectionsService();
    let request: google.maps.DirectionsRequest = {
      origin: this.miMarcador.getPosition(), 
      destination: this.marcadorDestino.getPosition(), 
      travelMode: google.maps.TravelMode.WALKING,
      provideRouteAlternatives: true,
    };
    directionsService.route(request, function(result) {
      directionsDisplay.setDirections(result);
    })  
  }
}
