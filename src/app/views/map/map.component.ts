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

  layersById = {};

  initialLoad = false;

  options = {
    layers: [this.streetMaps],
    zoom: 6,
    center: latLng([46.879966, -121.726909])
  };

  map: Map = null;

  openVehicle: boolean = false;

  /**
   * @private
   * @method onMapReady
   * Evento lanzado al finalizar el reenderizado del mapa
   */

  onMapReady(map: Map) {
    this.map = map;
  }

  /**
   * @private
   * @method constructor
   */

  constructor(
    router: Router,
    formBuilder: FormBuilder,
    private mapService: MapService
  ) {
    super(router, formBuilder);
  }

  computeHeading(lat1, long1, lat2, long2) {
    const math = Math as any;
    // Converts from degrees to radians.
    math.radians = function(degrees) {
      return (degrees * Math.PI) / 180;
    };

    // Converts from radians to degrees.
    math.degrees = function(radians) {
      return (radians * 180) / Math.PI;
    };

    var rlat1 = math.radians(lat1);
    var rlat2 = math.radians(lat2);

    var dlong = math.radians(long2 - long1);

    var y = math.cos(rlat2) * math.sin(dlong);
    var x =
      math.cos(rlat1) * math.sin(rlat2) -
      math.sin(rlat1) * math.cos(rlat2) * math.cos(dlong);
    var heading = math.round(math.degrees(math.atan2(y, x)) + 360, 4) % 360;

    return heading;
  }

  /**
   * @private
   * @method ngOnInit
   * Methodo del ciclo de vida de la vista
   */
  ngOnInit() {
    this.openVehicle = false;
    if (!this.initialLoad) {
      this.addMask("getVehicles");
      this.mapService.getVehicles().then((resp: any) => {
        for (let i = 0; i < resp.length; i++) {
          const car = {
            id: resp[i].equipo_id,
            lat: resp[i].latitud,
            long: resp[i].longitud,
            nextLat: resp[i].latitud_vehiculo,
            nextLong: resp[i].longitud_vehiculo,
            type: resp[i].tipo,
            state: resp[i].estado,
            icon: resp[i].icono,
            next: resp[i].siguiente,
            horometer: resp[i].horometro_total,
            typeNext: resp[i].tipo_mantenimiento,
            isOpen: false
          };

          const newMarker = marker([car.lat, car.long], {
            icon: icon({
              iconSize: [80, 80],
              iconAnchor: [40, 40],
              iconUrl: car.icon
            }),
            rotationAngle: this.computeHeading(
              car.lat,
              car.long,
              car.nextLat,
              car.nextLong
            )
          } as any);

          newMarker.bindTooltip(`
            <div class="px-1" py-1>
              <div class="w-100 py-1 border rounded border-secondary text-center text-wrap ${
                car.state == "Trabajando"
                  ? "bg-green"
                  : car.state == "Mantenimiento"
                  ? "bg-pink"
                  : "bg-purple"
              }">
                ${car.state}
              </div>
              <div class="py-1 w-100 text-left">ID: ${car.id}</div>
              <div class="py-1 w-100 text-left">
                Horometro: 
                ${car.horometer}
              </div>
              <div class="py-1 w-100 text-left">
                Próximo Man.: 
                ${car.next} 
                ${
                  car.typeNext == "Horometro" || car.typeNext == "Horas"
                    ? "horas"
                    : "kilometros"
                } 
              </div>
              <div class="w-100">
                <span class="w-100 text-truncate text-center">
                  Da clic en el vehiculo para visualizar su información
                </span>
              </div>
            <div>
        `);

          const scope = this;

          newMarker.on("click", function(ev) {
            scope.openVehicle = true;
            scope.router.navigate(["detailsvehicles"], {
              queryParams: { id: car.id }
            });
          });

          this.layersById[car.id] = newMarker;
          this.layersVehicles = this.layersVehicles.concat([newMarker as any]);
        }
        this.map.setView(latLng([resp[0].latitud, resp[0].longitud]), 6);
        this.removeMask("getVehicles");
        this.initialLoad = true;
        this.timeLoad();
      });
    }
  }

  /**
   * @private
   * @method timeLoad
   * Methodo para actualizar la información de los vehiculos
   */
  timeLoad() {
    const scope = this;
    setInterval(function() {
      if (scope.router.url === "/map" && this.initialLoad) {
        scope.mapService.getVehicles().then((resp: any) => {
          for (let i = 0; i < resp.length; i++) {
            const car = {
              id: resp[i].equipo_id,
              lat: resp[i].latitud,
              long: resp[i].longitud,
              nextLat: resp[i].latitud_vehiculo,
              nextLong: resp[i].longitud_vehiculo,
              type: resp[i].tipo,
              state: resp[i].estado,
              icon: resp[i].icono,
              next: resp[i].siguiente,
              horometer: resp[i].horometro_total,
              typeNext: resp[i].tipo_mantenimiento,
              isOpen: false
            };

            const marker = scope.layersById[car.id];

            if (marker) {
              marker.bindTooltip(`
              <div class="px-1" py-1>
                <div class="w-100 py-1 border rounded border-secondary text-center text-wrap ${
                  car.state == "Trabajando"
                    ? "bg-green"
                    : car.state == "Mantenimiento"
                    ? "bg-pink"
                    : "bg-purple"
                }">
                  ${car.state}
                </div>
                <div class="py-1 w-100 text-left">ID: ${car.id}</div>
                <div class="py-1 w-100 text-left">
                  Horometro: 
                  ${car.horometer}
                </div>
                <div class="py-1 w-100 text-left">
                  Próximo Man.: 
                  ${car.next} 
                  ${
                    car.typeNext == "Horometro" || car.typeNext == "Horas"
                      ? "horas"
                      : "kilometros"
                  } 
                </div>
                <div class="w-100">
                  <span class="w-100 text-truncate text-center">
                    Da clic en el vehiculo para visualizar su información
                  </span>
                </div>
              <div>
          `);

              marker.on("click", function(ev) {
                scope.openVehicle = true;
                scope.router.navigate(["detailsvehicles"], {
                  queryParams: { id: car.id }
                });
              });
            }
          }
        });
      }
    }, 500);
  }
}
