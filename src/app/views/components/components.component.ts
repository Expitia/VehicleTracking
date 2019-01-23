import { Router } from "@angular/router";
import { FormBuilder } from "@angular/forms";
import { BaseComponent } from "../base.component";
import { Component, OnInit, ViewChild } from "@angular/core";
import { MatPaginator, MatSort, MatTableDataSource } from "@angular/material";
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: "app-components",
  templateUrl: "./components.component.html"
})

/**
 * @public
 * @class ComponentsComponent
 *
 * Clase para la visualización de componentes
 */
export class ComponentsComponent extends BaseComponent implements OnInit {

  typesColumns = ["ID", "Nombre"];
  modelsColumns = ["ID", "Nombre"];
  systemsColumns = ["ID", "Nombre", "Modelo"];
  componentsColumns = ["ID", "Nombre", "Sistema", "Modelo"];
  activitiesColumns = ["ID", "Nombre", "Compartimiento", "Sistema", "Modelo"];

  vehicleTypeModal = null;
  modelModal = null;
  systemModal = null;
  componentModal = null;
  activityModal = null;

  modelList = [];
  systemList = [];
  componentList = [];

  validateMessages1 = null;
  validateMessages2 = null;
  validateMessages3 = null;
  validateMessages4 = null;
  validateMessages5 = null;

  validateLength1 = null;
  validateLength2 = null;
  validateLength3 = null;
  validateLength4 = null;
  validateLength5 = null;

  typesSource: MatTableDataSource<any>;
  modelsSource: MatTableDataSource<any>;
  systemsSource: MatTableDataSource<any>;
  componentsSource: MatTableDataSource<any>;
  activitiesSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator) typesPaginator: MatPaginator;
  @ViewChild(MatSort) typesSort: MatSort;

  @ViewChild(MatPaginator) modelsPaginator: MatPaginator;
  @ViewChild(MatSort) modelsSort: MatSort;

  @ViewChild(MatPaginator) systemsPaginator: MatPaginator;
  @ViewChild(MatSort) systemsSort: MatSort;

  @ViewChild(MatPaginator) componentsPaginator: MatPaginator;
  @ViewChild(MatSort) componentsSort: MatSort;

  @ViewChild(MatPaginator) activitiesPaginator: MatPaginator;
  @ViewChild(MatSort) activitiesSort: MatSort;
  /**
   * @private
   * @method constructor
   */
  constructor(
    private anotherRouter: Router,
    router: Router,
    formBuilder: FormBuilder,
    private modalService: NgbModal
  ) {
    super(router, formBuilder);

    this.typesSource = new MatTableDataSource([
      {
        ID: 1,
        Nombre: "Tractocamion"
      },
      {
        ID: 2,
        Nombre: "Tractomula"
      },
      {
        ID: 3,
        Nombre: "Camion"
      },
      {
        ID: 4,
        Nombre: "Delorian"
      }
    ]);

    this.modelsSource = new MatTableDataSource([
      {
        ID: 1,
        Nombre: "UX-02"
      },
      {
        ID: 2,
        Nombre: "UX-03"
      },
      {
        ID: 3,
        Nombre: "UX-04"
      },
      {
        ID: 4,
        Nombre: "UX-05"
      }
    ]);

    this.modelList = this.modelsSource.data.map(item => {
      return item.Nombre;
    });

    this.systemsSource = new MatTableDataSource([
      {
        ID: 1,
        Nombre: "Refrigeración",
        Modelo: "UX-02"
      },
      {
        ID: 2,
        Nombre: "Frenos",
        Modelo: "UX-05"
      },
      {
        ID: 3,
        Nombre: "Suspensión",
        Modelo: "UX-05"
      },
      {
        ID: 4,
        Nombre: "Propulsión",
        Modelo: "UX-04"
      }
    ]);

    this.systemList = this.systemsSource.data.map(item => {
      return item.Nombre;
    });

    this.componentsSource = new MatTableDataSource([
      {
        ID: 1,
        Nombre: "Aire condicionado",
        Sistema: "Refrigeración",
        Modelo: "UX-02"
      },
      {
        ID: 2,
        Nombre: "Caucho de parada",
        Sistema: "Frenos",
        Modelo: "UX-05"
      },
      {
        ID: 3,
        Nombre: "Resortes de acero inoxidable",
        Sistema: "Suspensión",
        Modelo: "UX-05"
      },
      {
        ID: 4,
        Nombre: "Motor AK-47",
        Sistema: "Propulsión",
        Modelo: "UX-04"
      }
    ]);

    this.componentList = this.componentsSource.data.map(item => {
      return item.Nombre;
    });

    this.activitiesSource = new MatTableDataSource([
      {
        ID: 1,
        Nombre: "Cambiar liquido",
        Compartimiento: "Aire condicionado",
        Sistema: "Refrigeración",
        Modelo: "UX-02"
      },
      {
        ID: 2,
        Nombre: "Torcer tambor",
        Compartimiento: "Caucho de parada",
        Sistema: "Frenos",
        Modelo: "UX-05"
      },
      {
        ID: 3,
        Nombre: "Girar tuercas",
        Compartimiento: "Resortes de acero inoxidable",
        Sistema: "Suspensión",
        Modelo: "UX-05"
      },
      {
        ID: 4,
        Nombre: "Rotar aceite",
        Compartimiento: "Motor AK-47",
        Sistema: "Propulsión",
        Modelo: "UX-04"
      }
    ]);

  }

  /**
   * @private
   * @method ngAfterViewInit
   * Methodo del ciclo de vida de la vista
   */
  ngAfterViewInit() {
    this.typesSource.paginator = this.typesPaginator;
    this.typesSource.sort = this.typesSort;

    this.modelsSource.paginator = this.modelsPaginator;
    this.modelsSource.sort = this.modelsSort;

    this.systemsSource.paginator = this.systemsPaginator;
    this.systemsSource.sort = this.systemsSort;

    this.componentsSource.paginator = this.componentsPaginator;
    this.componentsSource.sort = this.componentsSort;

    this.activitiesSource.paginator = this.activitiesPaginator;
    this.activitiesSource.sort = this.activitiesSort;
  }

  /**
   * @private
   * @method ngOnInit
   * Methodo del ciclo de vida de la vista
   */
  ngOnInit() {


    const createForm1 = this.createForm(["id_veh_type", "vehicle_type"], {
      id_veh_type: {
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
      vehicle_type: {
        minlength: "3",
        maxlength: "100",
        required: true,
        messages: {
          label: "",
          placeholder: "Tipo de vehiculo",
          minlength: "El nombre debe tener un mínimo de 3 carracteres",
          maxlength: "El nombre no puede superar los 10 carracteres",
          required: "Debe ingresar un nombre"
        }
      }
    });

    this.vehicleTypeModal = createForm1.form;
    this.validateLength1 = createForm1.validationLengths;
    this.validateMessages1 = createForm1.validationMessages;

    const createForm2 = this.createForm(["id_model", "model"], {
      id_model: {
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
      model: {
        minlength: "3",
        maxlength: "100",
        required: true,
        messages: {
          label: "",
          placeholder: "Modelo",
          minlength: "El nombre debe tener un mínimo de 3 carracteres",
          maxlength: "El nombre no puede superar los 10 carracteres",
          required: "Debe ingresar un nombre"
        }
      }
    });

    this.modelModal = createForm2.form;
    this.validateLength2 = createForm2.validationLengths;
    this.validateMessages2 = createForm2.validationMessages;


    const createForm3 = this.createForm(["id_system", "system", "model"], {
      id_system: {
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
      system: {
        minlength: "3",
        maxlength: "100",
        required: true,
        messages: {
          label: "",
          placeholder: "Sistema",
          minlength: "El nombre debe tener un mínimo de 3 carracteres",
          maxlength: "El nombre no puede superar los 10 carracteres",
          required: "Debe ingresar un nombre"
        }
      },
      model: {
        minlength: "3",
        maxlength: "100",
        required: true,
        messages: {
          label: "",
          placeholder: "Modelo",
          minlength: "El nombre debe tener un mínimo de 3 carracteres",
          maxlength: "El nombre no puede superar los 10 carracteres",
          required: "Debe ingresar un nombre"
        }
      }
    });


    this.systemModal = createForm3.form;
    this.validateLength3 = createForm3.validationLengths;
    this.validateMessages3 = createForm3.validationMessages;

    const createForm4 = this.createForm(["id_component", "component", "system", "model"], {
      id_component: {
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
      component: {
        minlength: "3",
        maxlength: "100",
        required: true,
        messages: {
          label: "",
          placeholder: "Componente",
          minlength: "El nombre debe tener un mínimo de 3 carracteres",
          maxlength: "El nombre no puede superar los 10 carracteres",
          required: "Debe ingresar un nombre"
        }
      },
      system: {
        minlength: "3",
        maxlength: "100",
        required: true,
        messages: {
          label: "",
          placeholder: "Sistema",
          minlength: "El nombre debe tener un mínimo de 3 carracteres",
          maxlength: "El nombre no puede superar los 10 carracteres",
          required: "Debe ingresar un nombre"
        }
      },
      model: {
        minlength: "3",
        maxlength: "100",
        required: true,
        messages: {
          label: "",
          placeholder: "Modelo",
          minlength: "El nombre debe tener un mínimo de 3 carracteres",
          maxlength: "El nombre no puede superar los 10 carracteres",
          required: "Debe ingresar un nombre"
        }
      }
    });

    this.componentModal = createForm4.form;
    this.validateLength4 = createForm4.validationLengths;
    this.validateMessages4 = createForm4.validationMessages;

    const createForm5 = this.createForm(["id_activity", "activity", "component", "system", "model"], {
      id_activity: {
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
      activity: {
        minlength: "3",
        maxlength: "100",
        required: true,
        messages: {
          label: "",
          placeholder: "Actividad",
          minlength: "El nombre debe tener un mínimo de 3 carracteres",
          maxlength: "El nombre no puede superar los 10 carracteres",
          required: "Debe ingresar un nombre"
        }},
      component: {
        minlength: "3",
        maxlength: "100",
        required: true,
        messages: {
          label: "",
          placeholder: "Componente",
          minlength: "El nombre debe tener un mínimo de 3 carracteres",
          maxlength: "El nombre no puede superar los 10 carracteres",
          required: "Debe ingresar un nombre"
        }},
      system: {
        minlength: "3",
        maxlength: "100",
        required: true,
        messages: {
          label: "",
          placeholder: "Sistema",
          minlength: "El nombre debe tener un mínimo de 3 carracteres",
          maxlength: "El nombre no puede superar los 10 carracteres",
          required: "Debe ingresar un nombre"
        }},
      model: {
        minlength: "3",
        maxlength: "100",
        required: true,
        messages: {
          label: "",
          placeholder: "Modelo",
          minlength: "El nombre debe tener un mínimo de 3 carracteres",
          maxlength: "El nombre no puede superar los 10 carracteres",
          required: "Debe ingresar un nombre"
        }
      }
    });

    this.activityModal = createForm5.form;
    this.validateLength5 = createForm5.validationLengths;
    this.validateMessages5 = createForm5.validationMessages;
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
   * @method onOpenCreate
   * Methodo handler lanzado al momento dar click sobre la opción de crear
   */
  onOpenCreate1() {
    this.vehicleTypeModal.controls.id_veh_type.setValue("");
    this.vehicleTypeModal.controls.vehicle_type.setValue("");
  }

  /**
   * @private
   * @method onOpenCreate
   * Methodo handler lanzado al momento dar click sobre la opción de crear
   */
  onOpenCreate2() {
    this.modelModal.controls.id_model.setValue("");
    this.modelModal.controls.model.setValue("");
  }

  /**
   * @private
   * @method onOpenCreate
   * Methodo handler lanzado al momento dar click sobre la opción de crear
   */
  onOpenCreate3() {
    this.systemModal.controls.id_system.setValue("");
    this.systemModal.controls.system.setValue("");
    this.systemModal.controls.model.setValue("");
  }

  /**
   * @private
   * @method onOpenCreate
   * Methodo handler lanzado al momento dar click sobre la opción de crear
   */
  onOpenCreate4() {
    this.componentModal.controls.id_component.setValue("");
    this.componentModal.controls.component.setValue("");
    this.componentModal.controls.system.setValue("");
    this.componentModal.controls.model.setValue("");
  }

  /**
   * @private
   * @method onOpenCreate
   * Methodo handler lanzado al momento dar click sobre la opción de crear
   */
  onOpenCreate5() {
    this.activityModal.controls.id_activity.setValue("");
    this.activityModal.controls.activity.setValue("");
    this.activityModal.controls.component.setValue("");
    this.activityModal.controls.system.setValue("");
    this.activityModal.controls.model.setValue("");
  }

  onCreate1(){
    this.typesSource.data = this.typesSource.data.concat({
      ID: Math.round(Math.random() * 50),
      Nombre: this.vehicleTypeModal.value.vehicle_type
    });
  }

  onCreate2(){
    this.modelsSource.data = this.modelsSource.data.concat({
      ID: Math.round(Math.random() * 50),
      Nombre: this.modelModal.value.model
    });
    this.modelList = this.modelList.concat(this.modelModal.value.model);
  }

  onCreate3(){
    this.systemsSource.data = this.systemsSource.data.concat({
      ID: Math.round(Math.random() * 50),
      Nombre: this.systemModal.value.system,
      Modelo: this.systemModal.value.model
    });
    this.systemList = this.systemList.concat(this.systemModal.value.system);
  }

  onCreate4(){
    this.componentsSource.data = this.componentsSource.data.concat({
      ID: Math.round(Math.random() * 50),
      Nombre: this.componentModal.value.component,
      Sistema: this.componentModal.value.system,
      Modelo: this.componentModal.value.model
    });
    this.componentList = this.componentList.concat(this.componentModal.value.component);
  }

  onCreate5(){
    this.activitiesSource.data = this.activitiesSource.data.concat({
      ID: Math.round(Math.random() * 50),
      Nombre: this.activityModal.value.activity,
      Compartimiento: this.activityModal.value.component,
      Sistema: this.activityModal.value.system,
      Modelo: this.activityModal.value.model
    });
  }

}
