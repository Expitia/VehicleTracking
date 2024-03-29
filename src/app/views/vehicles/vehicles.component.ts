import { Router } from "@angular/router";
import { FormBuilder } from "@angular/forms";
import { BaseComponent } from "../base.component";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ExcelService } from "../../services/excel.services";
import { Component, OnInit, ViewChild } from "@angular/core";
import { VehicleService } from "src/app/services/vehicles.services";
import { MatPaginator, MatSort, MatTableDataSource } from "@angular/material";
import Order from "../../utils/pdf";

@Component({
  selector: "app-vehicles",
  templateUrl: "./vehicles.component.html"
})

/**
 * @public
 * @class VehiclesComponent
 *
 * Clase para la vista e inventariado de vehiculos
 */
export class VehiclesComponent extends BaseComponent implements OnInit {
  displayedColumns = [
    "ID",
    "Nombre",
    "Tipo",
    "Modelo",
    "Próximo Mantenimiento",
    "Estado",
    "Disponibilidad",
    "Detalle"
  ];

  rowsExcel = {
    ID: true,
    Nombre: true,
    Tipo: true,
    Modelo: true,
    Estado: true,
    Disponibilidad: true,
    "Próximo Mantenimiento": true,
    "No. Mantenimientos": true
  };

  //Lista de modelos
  modelList = [];
  //Lista de tipos
  typeList = [];

  searchData = {
    type: "",
    model: "",
    state: "",
    minNext: "",
    maxNext: ""
  };

  dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  /**
   * @private
   * @method constructor
   */

  constructor(
    router: Router,
    formBuilder: FormBuilder,
    private modalService: NgbModal,
    private excelService: ExcelService,
    private vehicleService: VehicleService
  ) {
    super(router, formBuilder);
  }

  /**
   * @private
   * @method ngAfterViewInit
   * Methodo del ciclo de vida de la vista
   */

  ngAfterViewInit() {
    this.vehicleService.getVehicles().then((resp: any) => {
      //Se debe cargar de base de datos
      let cars = [];
      for (let i = 0; i < resp.length; i++) {
        let car = resp[i];
        cars.push({
          ID: car.id,
          Tipo: car.tipo_id,
          Detalle: car.id,
          Nombre: car.nombre,
          Estado: car.estado_vehiculo,
          Disponibilidad: car.disponibilidad,
          "Próximo Mantenimiento": car.proximo_mantenimiento,
          "No. Mantenimientos": car.numero_mantenimientos,
          Modelo: car.modelo_id, //Dato usaro para creación no se despliega en pantalla
          "Horas Configuradas": car.horas_configuradas, //Dato usaro para creación no se despliega en pantalla
          "Distancia Configurada": car.distancia_configurada, //Dato usaro para creación no se despliega en pantalla
          "Horometro Configurado": car.horometro_configurado, //Dato usaro para creación no se despliega en pantalla
          "Tipo Mantenimiento": car.tipo_mantenimiento //Dato usado para calcular no se despliega en pantalla
        });
      }
      this.dataSource = new MatTableDataSource(cars);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.dataSource.filterPredicate = (data, filter) => {
        let blFilter = true;

        for (let key in this.searchData) {
          if (this.searchData[key]) {
            if (key == "minNext")
              blFilter =
                blFilter &&
                data["Próximo Mantenimiento"] >= this.searchData[key];
            else if (key == "maxNext")
              blFilter =
                blFilter &&
                data["Próximo Mantenimiento"] <= this.searchData[key];
            else if (key == "type")
              blFilter = blFilter && data["Tipo"] == this.searchData[key];
            else if (key == "model")
              blFilter = blFilter && data["Modelo"] == this.searchData[key];
            else if (key == "state")
              blFilter =
                blFilter && data["Estado"].includes(this.searchData[key]);
          }
        }
        return blFilter;
      };
    });
    // Obtenemos la información de los modelos
    this.vehicleService.getModels().then(
      (resp: any) => {
        this.modelList = resp.map(item => {
          return {
            id: item.id,
            description: item.descripcion
          };
        });
      },
      (error: any) => {
        console.error("Unable to load models data");
      }
    );
    // Obtenemos la información de los tipos
    this.vehicleService.getTypes().then(
      (resp: any) => {
        this.typeList = resp.map(item => {
          return {
            id: item.id,
            description: item.descripcion
          };
        });
      },
      (error: any) => {
        console.error("Unable to load rols data");
      }
    );
  }

  /**
   * @private
   * @method onOpenModal
   * Methodo handler lanzado al momento dar click sobre una opción
   */
  onOpenModal(content, long) {
    const size = long || "lg";
    this.modalService.open(content, { centered: true, size });
  }

  /**
   * @private
   * @method showType
   * Methodo para visualizar los tipos dado el identificador
   */
  showType(id: number) {
    return this.typeList.filter(item => item.id == id)[0].description;
  }

  /**
   * @private
   * @method showModel
   * Methodo para visualizar un modelo dado el identificador
   */
  showModel(id: number) {
    return this.modelList.filter(item => item.id == id)[0].description;
  }

  /**
   * @private
   * @method onOpenEdit
   * Methodo handler lanzado al momento dar click sobre la opción de editar
   */
  onOpenEdit(row) {
    this.form.controls.id.setValue(row["ID"]);
    this.form.controls.name.setValue(row["Nombre"]);
    this.form.controls.type.setValue(row["Tipo"]);
    this.form.controls.model.setValue(row["Modelo"]);
    this.form.controls.distance.setValue(row["Distancia Configurada"]);
    this.form.controls.horometer.setValue(row["Horometro Configurado"]);
    this.form.controls.hours.setValue(row["Horas Configuradas"]);
    this.formSubmitted = false;
  }

  /**
   * @private
   * @method onOpenCreate
   * Methodo handler lanzado al momento dar click sobre la opción de crear
   */
  onOpenCreate() {
    this.form.controls.id.setValue("");
    this.form.controls.name.setValue("");
    this.form.controls.type.setValue("");
    this.form.controls.model.setValue("");
    this.form.controls.distance.setValue("");
    this.form.controls.horometer.setValue("");
    this.form.controls.hours.setValue("");
    this.formSubmitted = false;
  }

  /**
   * @private
   * @method onDownload
   * Methodo handler lanzado al momento dar click sobre la opción de descargar
   */
  onDownload(row) {
    let index = -1;

    if (row["Estado"] != "Mantenimiento") {
      this.vehicleService
        .createMaintenance({
          id: row["ID"]
        })
        .then((resp: any) => {
          index = this.dataSource.data.findIndex(item => {
            return item.ID === row["ID"];
          });
          this.dataSource.data = this.dataSource.data.map((item, idx) => {
            // En caso de corresponder al identificador que estamos buscando
            if (index === idx) {
              // Si se cumple exitosamente editamos el objeto
              return {
                ID: item["ID"],
                Tipo: item["Tipo"],
                Detalle: item["ID"],
                Nombre: item["Nombre"],
                Estado: "Mantenimiento",
                Modelo: item["Modelo"],
                Disponibilidad: item["Disponibilidad"],
                "Próximo Mantenimiento": resp.proximo_mantenimiento,
                "No. Mantenimientos": item["No. Mantenimientos"],
                "Horas Configuradas": item["Horas Configuradas"],
                "Distancia Configurada": item["Distancia Configurada"],
                "Horometro Configurado": item["Horometro"],
                "Tipo Mantenimiento": resp.tipo_mantenimiento
              };
            }
            return item;
          });
          Order.save("Orden de mantenimiento.pdf");
        });
    } else {
      Order.save("Orden de mantenimiento.pdf");
    }
  }

  /**
   * @private
   * @method onChangeFilter
   * Methodo handler lanzado al momento de escribir sobre un campo de filtro
   */
  onChangeFilter(filterValue: string, key: string) {
    this.searchData[key] = filterValue;
    this.dataSource.filter =
      this.dataSource.filter == filterValue || !filterValue
        ? Math.random() + ""
        : filterValue;
  }

  /**
   * @private
   * @method onChangeCheck
   * Methodo handler lanzado al momento de hacer click sobre un check
   */

  onChangeCheck(key: string) {
    this.rowsExcel[key] = !this.rowsExcel[key];
  }

  /**
   * @private
   * @method onExport
   * Methodo handler lanzado al momento de exportar los estilos
   */

  onExport = function() {
    this.excelService.exportAsExcelFile(
      this.dataSource.data.map(item => {
        let excelRow = { ...item };
        excelRow["Disponibilidad"] = excelRow["Disponibilidad"] + "%";
        excelRow["Próximo Mantenimiento"] =
          excelRow["Próximo Mantenimiento"] + " Horas";
        excelRow["Tipo"] = this.showType(excelRow["Tipo"]);
        excelRow["Modelo"] = this.showType(excelRow["Modelo"]);
        delete excelRow["Detalle"];

        for (let key in this.rowsExcel) {
          if (!this.rowsExcel[key]) delete excelRow[key];
        }
        return excelRow;
      }),
      "Equipos"
    );
  };

  /**
   * @private
   * @method onEdit
   * Methodo para editar un vehiculo
   */
  onEdit() {
    let index = -1;
    this.formSubmitted = true;

    if (this.form.valid) {
      this.modalService.dismissAll();

      // Consumimos el servicio para editarlo
      this.vehicleService
        .updateVehicle({
          id: this.form.value.id,
          nombre: this.form.value.name,
          tipos_id: this.form.value.type,
          modelo_id: this.form.value.model,
          distancia: this.form.value.distance,
          horometro: this.form.value.horometer,
          intervalos_mantenimiento: this.form.value.hours
        })
        .then((resp: any) => {
          index = this.dataSource.data.findIndex(item => {
            return item["ID"] === this.form.value.id;
          });
          this.dataSource.data = this.dataSource.data.map((item, idx) => {
            // En caso de corresponder al identificador que estamos buscando
            if (index === idx) {
              // Si se cumple exitosamente editamos el objeto
              return {
                ID: this.form.value.id,
                Tipo: this.form.value.type,
                Detalle: this.form.value.id,
                Nombre: this.form.value.name,
                Estado: item["Estado"],
                Disponibilidad: item["Disponibilidad"],
                "Próximo Mantenimiento": resp.proximo_mantenimiento,
                "No. Mantenimientos": item["No. Mantenimientos"],
                Modelo: this.form.value.model,
                "Horas Configuradas": this.form.value.hours,
                "Distancia Configurada": this.form.value.distance,
                "Horometro Configurado": this.form.value.horometer,
                "Tipo Mantenimiento": resp.tipo_mantenimiento
              };
            }
            return item;
          });
        });
    }
  }

  /**
   * @private
   * @method onCreate
   * Methodo lanzado por un evento, realiza la petición para registrar un vehiculo
   */
  onCreate() {
    this.formSubmitted = true;

    if (this.form.valid) {
      this.modalService.dismissAll();
      this.vehicleService
        .createVehicle({
          nombre: this.form.value.name,
          tipos_id: this.form.value.type,
          modelo_id: this.form.value.model,
          distancia: this.form.value.distance,
          horometro: this.form.value.horometer,
          intervalos_mantenimiento: this.form.value.hours
        })
        .then((resp: any) => {
          this.dataSource.data = this.dataSource.data.concat({
            ID: resp.id,
            Tipo: this.form.value.type,
            Detalle: resp.id,
            Nombre: this.form.value.name,
            Estado: "Trabajando",
            Disponibilidad: 100,
            "Próximo Mantenimiento": resp.proximo_mantenimiento,
            "No. Mantenimientos": 0,
            Modelo: this.form.value.model,
            "Horas Configuradas": this.form.value.hours,
            "Distancia Configurada": this.form.value.distance,
            "Horometro Configurado": this.form.value.horometer,
            "Tipo Mantenimiento": resp.tipo_mantenimiento
          });
        });
    }
  }

  /**
   * @private
   * @method ngOnInit
   * Methodo del ciclo de vida de la vista
   */

  ngOnInit() {
    //Indicamos las reglas de los campos
    this.fieldProps = {
      id: {
        minlength: "",
        maxlength: "",
        required: false,
        messages: {
          label: "",
          placeholder: "",
          minlength: "",
          maxlength: "",
          required: ""
        }
      },
      name: {
        minlength: "3",
        maxlength: "10",
        required: true,
        messages: {
          label: "",
          placeholder: "Nombre",
          minlength: "El nombre debe tener un mínimo de 3 carracteres",
          maxlength: "El nombre no puede superar los 10 carracteres",
          required: "Debe ingresar un nombre"
        }
      },
      model: {
        minlength: "",
        maxlength: "",
        required: true,
        messages: {
          label: "",
          placeholder: "Modelo del vehiculo",
          minlength: "",
          maxlength: "",
          required: "Se debe registrar un modelo valido"
        }
      },
      type: {
        minlength: "",
        maxlength: "",
        required: true,
        messages: {
          label: "",
          placeholder: "Tipo de vehiculo",
          minlength: "",
          maxlength: "",
          required: "Se debe registrar un tipo valido"
        }
      },
      horometer: {
        minlength: "",
        maxlength: "",
        required: false,
        messages: {
          label: "",
          placeholder: "Unidades de horometro entre mantenimientos",
          minlength: "",
          maxlength: "",
          required: ""
        }
      },
      hours: {
        minlength: "",
        maxlength: "",
        required: false,
        messages: {
          label: "",
          placeholder: "Horas entre mantenimientos",
          minlength: "",
          maxlength: "",
          required: ""
        }
      },
      distance: {
        minlength: "",
        maxlength: "",
        required: false,
        messages: {
          label: "",
          placeholder: "Distancia recorrida entre mantenimientos",
          minlength: "",
          maxlength: "",
          required: ""
        }
      }
    };
    super.ngOnInit();
  }
}
