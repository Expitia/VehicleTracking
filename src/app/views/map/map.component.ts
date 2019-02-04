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

  layersVehicles = [];

  options = {
    layers: [this.streetMaps],
    zoom: 0,
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
    this.mapService.getVehicles().then((resp: any) => {
      // Solo para datos de pruebas debe eliminarse
      for (let i = 0; i < resp.length; i++) {
        const car = {
          id: resp[i].equipo_id,
          lat: resp[i].latitud,
          long: resp[i].longitud,
          angle: resp[i].angulo,
          type: resp[i].tipo,
          state: resp[i].estado,
          icon: resp[i].icono
        };

        console.log(car);

        const newMarker = marker([car.lat, car.long], {
          rotationAngle: car.angle,
          icon: icon({
            iconSize: [25, 60],
            iconAnchor: [0, 0],
            iconUrl: car.icon
          })
        } as any);

        this.layersVehicles = this.layersVehicles.concat([newMarker as any]);
      }
    });
  }
}
