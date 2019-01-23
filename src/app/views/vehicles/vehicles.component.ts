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
    "Próximo Mantenimiento",
    "Ultimo Reporte",
    "Estado",
    "Disponibilidad",
    "Detalle"
  ];

  rowsExcel = {
    ID: true,
    Nombre: true,
    Tipo: true,
    Estado: true,
    Disponibilidad: true,
    "Próximo Mantenimiento": true,
    "No. Mantenimientos": true
  };

  //Se debe cargar de base de datos
  modelList = ["UX-02", "UX-05", "UX-08"];
  //Se debe cargar de base de datos
  typeList = ["Tractocamion", "Camion", "Forgoneta"];

  searchData = {
    type: "",
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
    this.vehicleService.getVehicles().then(resp => {
      //Se debe cargar de base de datos
      let cars = [];
      for (let i = 0; i < resp.length; i++) {
        let car = resp[i];
        cars.push({
          ID: car.id,
          Tipo: car.tipo,
          Detalle: car.id,
          Nombre: car.nombre,
          Estado: car.estado_vehiculo,
          Disponibilidad: car.disponibilidad,
          "Ultimo Reporte": car.ultima_solicitud,
          "Próximo Mantenimiento": car.proximo_mantenimiento,
          "No. Mantenimientos": car.numero_mantenimientos,
          "ID Modelo": car.id_modelo, //Dato usaro para creación no se despliega en pantalla
          "ID Tipo": car.id_tipo, //Dato usaro para creación no se despliega en pantalla
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
              blFilter =
                blFilter && data["Tipo"].includes(this.searchData[key]);
            else if (key == "state")
              blFilter =
                blFilter && data["Estado"].includes(this.searchData[key]);
          }
        }
        return blFilter;
      };
    });
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
   * @method onOpenEdit
   * Methodo handler lanzado al momento dar click sobre la opción de editar
   */
  onOpenEdit(row) {
    this.form.controls.id.setValue(row["ID"]);
    this.form.controls.name.setValue(row["Nombre"]);
    this.form.controls.hours.setValue("Horas Configuradas");
    this.form.controls.distance.setValue("Distancia Configurada");
    this.form.controls.typeList.setValue("ID Tipo");
    this.form.controls.modelList.setValue("ID Modelo");
    this.form.controls.horometer.setValue("Horometro Configurado");
  }

  /**
   * @private
   * @method onOpenCreate
   * Methodo handler lanzado al momento dar click sobre la opción de crear
   */
  onOpenCreate() {
    this.form.controls.id.setValue("");
    this.form.controls.name.setValue("");
    this.form.controls.hours.setValue("");
    this.form.controls.distance.setValue("");
    this.form.controls.typeList.setValue("");
    this.form.controls.modelList.setValue("");
    this.form.controls.horometer.setValue("");
  }

  /**
   * @private
   * @method onOpenCreate
   * Methodo handler lanzado al momento dar click sobre la opción de descargar
   */
  onDownload() {
    Order.save("Orden de mantenimiento.pdf");
  }

  /**
   * @private
   * @method onChangeFilter
   * Methodo handler lanzado al momento de escribir sobre un campo de filtro
   */
  onChangeFilter(filterValue: string, key: string) {
    this.searchData[key] = filterValue;
    this.dataSource.filter = filterValue;
  }

  /**
   * @private
   * @method onMaxHours
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

        delete excelRow["Detalle"];
        delete excelRow["Ultimo Reporte"];

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
   * @method onCreate
   * Methodo lanzado por un evento, realiza la petición para registrar al usuario
   */
  onCreate() {
    this.formSubmitted = true;

    if (this.form.valid) {
      this.vehicleService
        .createVehicle({
          name: this.form.value.name,
          type: this.form.value.typeList,
          model: this.form.value.modelList,
          horometer: this.form.value.horometer,
          hours: this.form.value.hours,
          distance: this.form.value.distance
        })
        .then(response => {}, error => {});
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
