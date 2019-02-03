import { Router } from "@angular/router";
import { FormBuilder } from "@angular/forms";
import { BaseComponent } from "../base.component";
import { Component, OnInit } from "@angular/core";
import { MapService } from "src/app/services/map.services";
import { icon, latLng, Map, tileLayer, marker, polyline, point } from "leaflet";
import "leaflet-rotatedmarker";

@Component({
  selector: "app-map",
  templateUrl: "./map.component.html"
})

/**
 * @public
 * @class MapComponent
 *
 * Clase para los mapas y visualización de vehiculos
 */
export class MapComponent extends BaseComponent implements OnInit {
  //Se debe cargar de base de datos
  typesMapList = [
    {
      type: "UX-02",
      images: {
        Trabajando: "",
        Mantenimiento: "",
        Desacoplado: "",
        Acoplado: ""
      }
    },
    {
      type: "UX-08",
      images: {
        Trabajando: "",
        Mantenimiento: "",
        Desacoplado: "",
        Acoplado: ""
      }
    },
    {
      type: "UX-05",
      images: {
        Trabajando: "",
        Mantenimiento: "",
        Desacoplado: "",
        Acoplado: ""
      }
    }
  ];

  streetMaps = tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    detectRetina: true,
    attribution:
      '&amp;copy; &lt;a href="https://www.openstreetmap.org/copyright"&gt;OpenStreetMap&lt;/a&gt; contributors'
  });

  wMaps = tileLayer("http://maps.wikimedia.org/osm-intl/{z}/{x}/{y}.png", {
    detectRetina: true,
    attribution:
      '&amp;copy; &lt;a href="https://www.openstreetmap.org/copyright"&gt;OpenStreetMap&lt;/a&gt; contributors'
  });

  layersControl = {
    baseLayers: {
      "Street Maps": this.streetMaps,
      "Wikimedia Maps": this.wMaps
    },
    overlays: {}
  };

  options = {
    layers: [this.streetMaps],
    zoom: 18,
    center: latLng([46.879966, -121.726909])
  };

  /**
   * @private
   * @method onMapReady
   * Evento lanzado al finalizar el reenderizado del mapa
   */

  onMapReady(map: Map) {}

  /**
   * @private
   * @method constructor
   */

  constructor(
    private anotherRouter: Router,
    router: Router,
    formBuilder: FormBuilder,
    private mapService: MapService 
  ) {
    super(router, formBuilder);
  }

  /**
   * @private
   * @method ngOnInit
   * Methodo del ciclo de vida de la vista
   */

  ngOnInit() {
    // Solo para datos de pruebas debe eliminarse
    const states = ["Trabajando", "Mantenimiento", "Desacoplado"];
    // Solo para datos de pruebas debe eliminarse
    const types = ["UX-02", "UX-08", "UX-05"];
    for (let i = 0; i < 3; i++) {
      const car = {
        id: i,
        lat: 46.879966 + i / 50,
        long: -121.726909 + i / 50,
        angle: Math.random() * 180,
        type: types[Math.floor(Math.random() * 3)],
        state: states[Math.floor(Math.random() * 3)]
      };

      const newMarker = marker([car.lat, car.long], {
        rotationAngle: car.angle,
        icon: icon({
          iconSize: [25, 60],
          iconAnchor: [0, 0],
          iconUrl: this.typesMapList.filter(item => item.type == car.type)[0]
            .images[car.state]
        })
      } as any);

      this.options.layers = this.options.layers.concat([newMarker as any]);
    }
  }
}
