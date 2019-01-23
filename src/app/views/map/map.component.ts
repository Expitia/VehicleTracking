import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { BaseComponent } from '../base.component';
import { Component, OnInit } from '@angular/core';
import { icon, latLng, Map, tileLayer, marker, polyline, point } from 'leaflet';
import 'leaflet-rotatedmarker';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html'
})

/**
 * @public
 * @class MapComponent
 * 
 * Clase para los mapas y visualización de vehiculos
 */
export class MapComponent extends BaseComponent implements OnInit {

  //Se debe cargar de base de datos
  typesList = [
    "UX-02",
    "UX-05",
    "UX-08"
  ];

  streetMaps = tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    detectRetina: true,
    attribution: '&amp;copy; &lt;a href="https://www.openstreetmap.org/copyright"&gt;OpenStreetMap&lt;/a&gt; contributors'
  });

  wMaps = tileLayer('http://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png', {
    detectRetina: true,
    attribution: '&amp;copy; &lt;a href="https://www.openstreetmap.org/copyright"&gt;OpenStreetMap&lt;/a&gt; contributors'
  });
  layersControl = {
    baseLayers: {
      'Street Maps': this.streetMaps,
      'Wikimedia Maps': this.wMaps
    },
    overlays: { }
  };

  options = {
    layers: [ this.streetMaps ],
    zoom: 18,
    center: latLng([ 46.879966, -121.726909 ])
  };

  /**
	 * @private
	 * @method onMapReady
   * Evento lanzado al finalizar el reenderizado del mapa
   */	
  onMapReady(map: Map) { }
  
  /**
	 * @private
	 * @method constructor
	 */	
  constructor(private anotherRouter:Router, router: Router, formBuilder: FormBuilder) { 
    super(router, formBuilder);
  }
  
  /**
	 * @private
	 * @method ngOnInit 
	 * Methodo del ciclo de vida de la vista
	 */	
  ngOnInit() {    
    for (let i = 0; i < 3; i ++){

      let randomValue = this.typesList[Math.floor(Math.random() * 3)],
        newMarker = marker([ 46.879966 + i/50, -121.726909+ i/50 ], {       
          rotationAngle: 45,
          icon: icon({
            iconSize: [ 25, 60 ],
            iconAnchor: [ 0, 0 ],
            iconUrl: require(
              randomValue == this.typesList[0] ? '../../../assets/img/cars/tractocamion_lleno.png' :
              randomValue == this.typesList[1] ? '../../../assets/img/cars/tractocamion_vacio.png' :
              '../../../assets/img/cars/camion.png'
            )
          })
        } as any);
    
        this.options.layers = this.options.layers.concat([newMarker as any]);
    }

  }

}
