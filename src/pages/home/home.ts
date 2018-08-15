import { Component, ViewChild, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { } from '@types/googlemaps';
import { Http } from '@angular/http';
import { Proveedor1Provider } from '../../providers/proveedor1/proveedor1';

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
  iglesiaSeleccionadaId: number;
  iglesias: any;
  webServiceURL = 'https://oscaredu03.000webhostapp.com/server/iglesia/leer';
  
  constructor(public navCtrl: NavController, private geolocation: Geolocation, public http: Http, public proveedor: Proveedor1Provider) {

  }

  ionViewDidLoad(){
    this.proveedor.obtenerDatos()
    .subscribe(
      (data)=>{this.iglesias=data;},
      (error)=>{console.log(error);}
    )
  }

  seleccionaIglesia(idIglesia: number) {
    this.iglesias.forEach(element => {
      if(element.id == idIglesia){
        // ACA SE DIBUJA EL MARCADOR
        this.marcadorDestino = new google.maps.Marker({
          position: this.iglesias, //consulta
          map: this.map,
          animation: google.maps.Animation.DROP
        });
        console.log(element);
        this.iniciarMarcadores(element.latitud,element.longitud);        
      }
    });
  }

  
  seleccionaIglesiaDescripcion(descripcion: string) {
    this.iglesias.forEach(element => {
      if(element.id == descripcion){
        // ACA SE DIBUJA EL MARCADOR
        this.marcadorDestino = new google.maps.Marker();

        //console.log("Hola");
      }
    });
  }


  ngOnInit() {
    this.startGoogleMap();
    this.escucharGPS();
  }

  startGoogleMap() {
    const mapProp = {
        center: new google.maps.LatLng(-0.2188964,-78.5138881), //coordenadas donde se inicia el mapa
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    };
    this.map = new google.maps.Map(this.gmapElement.nativeElement, mapProp);
    
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

  iniciarMarcadores(x,y) {
    this.miMarcador = new google.maps.Marker({
      position: new google.maps.LatLng(x,y), //base de datos
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
      info.setContent('seleccionaIglesiaDescripcion()'); 
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

  //metodo para obtener la lista de los datos desde el servidor
  loadIglesias(){
    return this.http
    .get(this.webServiceURL)
    .toPromise();
  }

  cargarIglesias(){
    this.http.loadIglesias.subscribe(
      (res) => { 
        this.iglesias = res['results'];
      },
      (error) =>{
        console.error(error);
      }
    )
  }
}
