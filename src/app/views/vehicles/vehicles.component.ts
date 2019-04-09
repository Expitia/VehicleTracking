import { Router } from "@angular/router";
import { FormBuilder, FormArray } from "@angular/forms";
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

  // Modales
  testModal = null;
  //Lista de modelos
  modelList = [];
  //Lista de tipos
  typeList = [];
  //Lista de actividades
  activitiesList = [];
  // Mensajes de validación
  validateMessagesTest = null;
  validateLengthTest = null;

  searchData = {
    type: "",
    model: "",
    state: "",
    minNext: "",
    maxNext: ""
  };

  auxFormLength: {};
  auxFormMessage: {};

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
    this.addMask("getVehicles");
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
          Disponibilidad: "" + car.disponibilidad,
          "Próximo Mantenimiento": car.proximo_mantenimiento,
          "No. Mantenimientos": car.numero_mantenimientos,
          Modelo: car.modelo_id, //Dato usaro para creación no se despliega en pantalla
          "Tipo Mantenimiento": car.tipo_mantenimiento, //Dato usado para calcular no se despliega en pantalla
          Configuraciones: car.configuraciones //Dato usado para la edición de la información no se despliega en pantalla
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
      this.removeMask("getVehicles");
    });
    this.addMask("getModels");
    // Obtenemos la información de los modelos
    this.vehicleService.getModels().then(
      (resp: any) => {
        this.modelList = resp.map(item => {
          return {
            id: item.id,
            description: item.descripcion
          };
        });
        this.removeMask("getModels");
      },
      (error: any) => {
        console.error("No es posible cargar los modelos");
      }
    );
    this.addMask("getActivities");
    // Obtenemos la lista de actividades
    this.vehicleService.getActivities().then(
      (resp: any) => {
        this.activitiesList = resp.map(item => {
          return {
            id: item.id,
            description: item.descripcion
          };
        });
        this.removeMask("getActivities");
      },
      (error: any) => {
        console.error("No es posible cargar las actividades");
      }
    );
    this.addMask("getTypes");
    // Obtenemos la información de los tipos
    this.vehicleService.getTypes().then(
      (resp: any) => {
        this.typeList = resp.map(item => {
          return {
            id: item.id,
            description: item.descripcion
          };
        });
        this.removeMask("getTypes");
      },
      (error: any) => {
        console.error("No es posible cargar los tipos");
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
    const type = this.typeList.filter(item => item.id == id)[0];
    return (type && type.description) || "";
  }

  /**
   * @private
   * @method showModel
   * Methodo para visualizar un modelo dado el identificador
   */
  showModel(id: number) {
    const model = this.modelList.filter(item => item.id == id)[0];
    return (model && model.description) || "";
  }

  /**
   * @private
   * @method onOpenEdit
   * Methodo handler lanzado al momento dar click sobre la opción de editar
   */
  onOpenEdit(row) {
    const configs = (row["Configuraciones"] &&
      row["Configuraciones"].length > 0 &&
      row["Configuraciones"].map(item => {
        return {
          distancia: item.distancia,
          horometro: item.horometro,
          actividades: item.actividades,
          intervalos_mantenimiento: item.horas || item.intervalos_mantenimiento
        };
      })) || [
      {
        distancia: "",
        horometro: "",
        actividades: [],
        intervalos_mantenimiento: ""
      }
    ];

    this.form.controls.id.setValue(row["ID"]);
    this.form.controls.name.setValue(row["Nombre"]);
    this.form.controls.type.setValue(row["Tipo"]);
    this.form.controls.model.setValue(row["Modelo"]);
    //Se limpia las configuraciones previamentes definidad
    for (let i = 0; i < this.configurationsArray.length; i++) {
      this.removeConfiguration(i);
      i--;
    }
    //Se recorren las nuevas configuraciones a visualizar
    configs.map(item => {
      const form = this.addConfigurationsGroup();
      form.controls.horometro.setValue(item["horometro"]);
      form.controls.distancia.setValue(item["distancia"]);
      form.controls.actividades.setValue(item["actividades"]);
      form.controls.intervalos_mantenimiento.setValue(
        item["intervalos_mantenimiento"]
      );
      this.configurationsArray.push(form);
    });

    this.formSubmitted = false;
  }

  /**
   * @private
   * @method onOpenTest
   * Methodo handler lanzado al momento dar click sobre la opción editar
   */
  onOpenTest() {
    /* this.form.controls.id.setValue("");
    this.form.controls.name.setValue("");
    this.form.controls.type.setValue("");
    this.form.controls.model.setValue("");
    //Se limpia las configuraciones previamentes definidad
    for (let i = 0; i < this.configurationsArray.length; i++) {
      this.removeConfiguration(i);
      i--;
    }
    this.addConfiguration(); */
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
    //Se limpia las configuraciones previamentes definidad
    for (let i = 0; i < this.configurationsArray.length; i++) {
      this.removeConfiguration(i);
      i--;
    }
    this.addConfiguration();
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
      this.addMask("createMaintenance");
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
                "Tipo Mantenimiento": resp.tipo_mantenimiento,
                Configuraciones: item["Configuraciones"]
              };
            }
            return item;
          });
          Order.save("Orden de mantenimiento.pdf");
          this.removeMask("createMaintenance");
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
    let isValid = true;
    this.formSubmitted = true;

    const controls = { ...this.form.controls[0] };
    delete controls["configuraciones"];

    for (let key in controls) {
      isValid = isValid && controls[key].valid;
    }

    if (isValid) {
      this.modalService.dismissAll();

      this.addMask("updateVehicle");
      // Consumimos el servicio para editarlo
      this.vehicleService
        .updateVehicle({
          id: this.form.value.id,
          nombre: this.form.value.name,
          tipos_id: this.form.value.type,
          modelo_id: this.form.value.model,
          configuraciones: this.form.value.configuraciones
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
                "Tipo Mantenimiento": resp.tipo_mantenimiento,
                Configuraciones: this.form.value.configuraciones
              };
            }
            return item;
          });
          this.removeMask("updateVehicle");
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
      this.addMask("createVehicle");
      this.modalService.dismissAll();
      this.vehicleService
        .createVehicle({
          nombre: this.form.value.name,
          tipos_id: this.form.value.type,
          modelo_id: this.form.value.model,
          configuraciones: this.form.value.configuraciones
        })
        .then((resp: any) => {
          this.dataSource.data = this.dataSource.data.concat({
            ID: resp.id,
            Tipo: this.form.value.type,
            Detalle: resp.id,
            Nombre: this.form.value.name,
            Estado: "Trabajando",
            Disponibilidad: "100",
            "Próximo Mantenimiento": resp.proximo_mantenimiento,
            "No. Mantenimientos": 0,
            Modelo: this.form.value.model,
            "Tipo Mantenimiento": resp.tipo_mantenimiento,
            Configuraciones: this.form.value.configuraciones
          });
          this.removeMask("createVehicle");
        });
    }
  }

  /**
   * @private
   * @method ngOnInit
   * Methodo del ciclo de vida de la vista
   */

  ngOnInit() {
    const createForm2 = this.createForm(
      [
        "vehiculo_id",
        "latitud",
        "longitud",
        "distancia_ultima",
        "horometro_ultimo",
        "hora_ultima"
      ],
      {
        vehiculo_id: {
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
        latitud: {
          minlength: "3",
          maxlength: "20",
          required: true,
          messages: {
            label: "",
            placeholder: "Modelo",
            minlength: "El nombre debe tener un mínimo de 3 caracteres",
            maxlength: "El nombre no puede superar los 20 caracteres",
            required: "Debe ingresar un nombre"
          }
        },
        longitud: {
          minlength: "3",
          maxlength: "20",
          required: true,
          messages: {
            label: "",
            placeholder: "Modelo",
            minlength: "El nombre debe tener un mínimo de 3 caracteres",
            maxlength: "El nombre no puede superar los 20 caracteres",
            required: "Debe ingresar un nombre"
          }
        },
        distancia_ultima: {
          minlength: "3",
          maxlength: "20",
          required: true,
          messages: {
            label: "",
            placeholder: "Modelo",
            minlength: "El nombre debe tener un mínimo de 3 caracteres",
            maxlength: "El nombre no puede superar los 20 caracteres",
            required: "Debe ingresar un nombre"
          }
        },
        horometro_ultimo: {
          minlength: "3",
          maxlength: "20",
          required: true,
          messages: {
            label: "",
            placeholder: "Modelo",
            minlength: "El nombre debe tener un mínimo de 3 caracteres",
            maxlength: "El nombre no puede superar los 20 caracteres",
            required: "Debe ingresar un nombre"
          }
        },
        hora_ultima: {
          minlength: "3",
          maxlength: "20",
          required: true,
          messages: {
            label: "",
            placeholder: "Modelo",
            minlength: "El nombre debe tener un mínimo de 3 caracteres",
            maxlength: "El nombre no puede superar los 20 caracteres",
            required: "Debe ingresar un nombre"
          }
        }
      }
    );

    /* // Formulario test
    const createFormTest = this.createForm(
      ["id_vehiculo", "latitud", "longitud", "distancia", "horometro", "hora"],
      {
        id_vehiculo: {
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
        latitud: {
          minlength: "3",
          maxlength: "100",
          required: true,
          messages: {
            label: "",
            placeholder: "Latitud",
            minlength: "La latitud debe tener un mínimo de 3 carracteres",
            maxlength: "La latitud no puede superar los 100 carracteres",
            required: "Debe ingresar una latitud"
          }
        },
        longitud: {
          minlength: "3",
          maxlength: "100",
          required: true,
          messages: {
            label: "",
            placeholder: "Longitud",
            minlength: "La longitud debe tener un mínimo de 3 carracteres",
            maxlength: "La longitud no puede superar los 100 carracteres",
            required: "Debe ingresar una longitud"
          }
        },
        distancia: {
          minlength: "3",
          maxlength: "100",
          required: true,
          messages: {
            label: "",
            placeholder: "Distancia",
            minlength: "La distancia debe tener un mínimo de 3 carracteres",
            maxlength: "La distancia no puede superar los 100 carracteres",
            required: "Debe ingresar una distancia"
          }
        },
        horometro: {
          minlength: "3",
          maxlength: "100",
          required: true,
          messages: {
            label: "",
            placeholder: "Horómetro",
            minlength: "El horómetro debe tener un mínimo de 3 carracteres",
            maxlength: "El horómetro no puede superar los 100 carracteres",
            required: "Debe ingresar un horómetro"
          }
        }
      }
    );

    this.testModal = createFormTest.form;
    this.validateLengthTest = createFormTest.validationLengths;
    this.validateMessagesTest = createFormTest.validationMessages;
 */
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
        maxlength: "50",
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
      configuraciones: {
        value: this.formBuilder.array([this.addConfigurationsGroup()]),
        basicData: true
      }
    };

    super.ngOnInit();
  }

  addConfigurationsGroup() {
    const formResult = this.createForm(
      ["horometro", "intervalos_mantenimiento", "distancia", "actividades"],
      {
        horometro: {
          minlength: "",
          maxlength: "",
          required: true,
          messages: {
            label: "",
            placeholder: "Unidades de horometro entre mantenimientos",
            minlength: "",
            maxlength: "",
            required: ""
          }
        },
        intervalos_mantenimiento: {
          minlength: "",
          maxlength: "",
          required: true,
          messages: {
            label: "",
            placeholder: "Horas entre mantenimientos",
            minlength: "",
            maxlength: "",
            required: ""
          }
        },
        distancia: {
          minlength: "",
          maxlength: "",
          required: true,
          messages: {
            label: "",
            placeholder: "Distancia recorrida entre mantenimientos",
            minlength: "",
            maxlength: "",
            required: ""
          }
        },
        actividades: {
          minlength: "",
          maxlength: "",
          required: true,
          messages: {
            label: "",
            placeholder: "Actividades asociadas",
            minlength: "",
            maxlength: "",
            required: "Se debe registrar al menos una actividad"
          }
        }
      }
    );

    this.auxFormLength = formResult.validationLengths;
    this.auxFormMessage = formResult.validationMessages;

    return formResult.form;
  }

  addConfiguration() {
    this.configurationsArray.push(this.addConfigurationsGroup());
  }
  removeConfiguration(index) {
    this.configurationsArray.removeAt(index);
  }
  get configurationsArray() {
    return <FormArray>this.form.get("configuraciones");
  }

  // Método encargado de lanzar petición de prueba para actualizar vehículo
  onCreateTest() {
    debugger;
  }
}
