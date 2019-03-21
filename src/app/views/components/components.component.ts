import { Router } from "@angular/router";
import { FormBuilder } from "@angular/forms";
import { BaseComponent } from "../base.component";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { ExcelService } from "../../services/excel.services";
import { Component, OnInit, ViewChild } from "@angular/core";
import { VehicleService } from "src/app/services/vehicles.services";
import { MatPaginator, MatSort, MatTableDataSource, MatTabGroup } from "@angular/material";
import Order from "../../utils/pdf";
import { ComponentsService } from "src/app/services/components.service";


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
  catalogsColumns = ["ID", "Nombre"];
  symptomsColumns = ["ID", "Nombre", "Catalogo"];

  // Modales
  vehicleTypeModal = null;
  modelModal = null;
  systemModal = null;
  componentModal = null;
  activityModal = null;
  catalogModal = null;
  symptomModal = null;

  // Listas
  typeList = [];
  modelList = [];
  systemList = [];
  catalogList = [];
  componentList = [];
  
  // Mensajes de validación
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

  // Sources
  typesSource: MatTableDataSource<any>;
  modelsSource: MatTableDataSource<any>;
  systemsSource: MatTableDataSource<any>;
  componentsSource: MatTableDataSource<any>;
  activitiesSource: MatTableDataSource<any>;
  catalogsSource: MatTableDataSource<any>;
  symptomsSource: MatTableDataSource<any>;

  searchData = {
    type: "",
    model: "",
    state: "",
    minNext: "",
    maxNext: ""
  };

  // MatSorts - Paginators
  @ViewChild('matGroup') matTabGroup: MatTabGroup;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  @ViewChild('typesPaginator') typesPaginator: MatPaginator;
  @ViewChild(MatSort) typesSort: MatSort;

  @ViewChild('modelsPaginator') modelsPaginator: MatPaginator;
  @ViewChild(MatSort) modelsSort: MatSort;

  @ViewChild('systemsPaginator') systemsPaginator: MatPaginator;
  @ViewChild(MatSort) systemsSort: MatSort;

  @ViewChild('componentsPaginator') componentsPaginator: MatPaginator;
  @ViewChild(MatSort) componentsSort: MatSort;

  @ViewChild('activitiesPaginator') activitiesPaginator: MatPaginator;
  @ViewChild(MatSort) activitiesSort: MatSort;

  @ViewChild('catalogsPaginator') catalogsPaginator: MatPaginator;
  @ViewChild(MatSort) catalogsSort: MatSort;

  @ViewChild('symptomsPaginator') symptomsPaginator: MatPaginator;
  @ViewChild(MatSort) symptomsSort: MatSort;
  
  /**
   * @private
   * @method constructor
   */
  constructor(
    private anotherRouter: Router,
    router: Router,
    formBuilder: FormBuilder,
    private modalService: NgbModal,
    private componentsService: ComponentsService
  ) {
    super(router, formBuilder);

  }

  /**
   * @private
   * @method ngAfterViewInit
   * Methodo del ciclo de vida de la vista
   */
  ngAfterViewInit() {
    // Carga tipos de vehículos
    this.componentsService.getVehiclesType().then((resp: any) => {
      let types = [];

      // Lista de tipos
      this.typeList = resp.map(item => {
        return {
          id: item.id,
          description: item.descripcion
        };
      });

      for (let i = 0; i < resp.length; i++) {
        let type = resp[i];
        types.push({
          ID: type.id,
          Nombre: type.descripcion
        });
      }
      this.typesSource = new MatTableDataSource(types);
      this.typesSource.paginator = this.typesPaginator;
      this.typesSource.sort = this.typesSort;
      this.typesSource.filterPredicate = (data, filter) => {
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

    // Modelos
    this.componentsService.getModels().then((resp: any) => {
      let models = [];

      // Lista de modelos
      this.modelList = resp.map(item => {
        return {
          id: item.id,
          description: item.descripcion
        };
      });

      for (let i = 0; i < resp.length; i++) {
        let model = resp[i];
        models.push({
          ID: model.id,
          Nombre: model.descripcion
        });
      }
      this.modelsSource = new MatTableDataSource(models);
      this.modelsSource.paginator = this.modelsPaginator;
      this.modelsSource.sort = this.modelsSort;
    });

    // Sistemas
    this.componentsService.getSystems().then((resp: any) => {
      // Lista de sistemas
      this.systemList = resp.map(item => {
        return {
          id: item.id,
          description: item.nombre
        };
      });

      let systems = [];
      for (let i = 0; i < resp.length; i++) {
        let system = resp[i];
        systems.push({
          ID: system.id,
          Nombre: system.nombre,
          Modelo: system.modelo_id
        });
      }
      this.systemsSource = new MatTableDataSource(systems);
      this.systemsSource.paginator = this.systemsPaginator;
      this.systemsSource.sort = this.systemsSort;
    });

    // Compartimientos
    this.componentsService.getCompartments().then((resp: any) => {
        // Lista de compartimientos
        this.componentList = resp.map(item => {
          return {
            id: item.id,
            description: item.descripcion
          };
        });

      let compartments = [];
      for (let i = 0; i < resp.length; i++) {
        let compartment = resp[i];
        compartments.push({
          ID: compartment.id,
          Nombre: compartment.descripcion,
          Sistema: compartment.sistemas_id
        });
      }
      this.componentsSource = new MatTableDataSource(compartments);
      this.componentsSource.paginator = this.componentsPaginator;
      this.componentsSource.sort = this.componentsSort;
    });

    // Actividades
    this.componentsService.getActivities().then((resp: any) => {
      let activities = [];
      for (let i = 0; i < resp.length; i++) {
        let activity = resp[i];
        activities.push({
          ID: activity.id,
          Nombre: activity.descripcion,
          Compartimiento: activity.compartimientos_id
        });
      }
      this.activitiesSource = new MatTableDataSource(activities);
      this.activitiesSource.paginator = this.activitiesPaginator;
      this.activitiesSource.sort = this.activitiesSort;
    });

     // Catálogos
     this.componentsService.getCatalogs().then((resp: any) => {
      let catalogs = [];

      // Lista de catálogos
      this.catalogList = resp.map(item => {
        return {
          id: item.id,
          description: item.descripcion
        };
      });

      for (let i = 0; i < resp.length; i++) {
        let catalog = resp[i];
        catalogs.push({
          ID: catalog.id,
          Nombre: catalog.descripcion
        });
      }
      this.catalogsSource = new MatTableDataSource(catalogs);
      this.catalogsSource.paginator = this.catalogsPaginator;
      this.catalogsSource.sort = this.catalogsSort;
    });
  }

  /**
   * @private
   * @method ngOnInit
   * Methodo del ciclo de vida de la vista
   */
  ngOnInit() {

    const createForm2 = this.createForm(["id_model", "modelo_id"], {
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
      modelo_id: {
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
    });

    this.modelModal = createForm2.form;
    this.validateLength2 = createForm2.validationLengths;
    this.validateMessages2 = createForm2.validationMessages;


    const createForm3 = this.createForm(["id_system", "system", "modelo_id"], {
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
        maxlength: "30",
        required: true,
        messages: {
          label: "",
          placeholder: "Sistema",
          minlength: "El nombre debe tener un mínimo de 3 carracteres",
          maxlength: "El nombre no puede superar los 30 carracteres",
          required: "Debe ingresar un nombre"
        }
      },
      modelo_id: {
        minlength: "1",
        maxlength: "30",
        required: true,
        messages: {
          label: "",
          placeholder: "Modelo",
          minlength: "El nombre debe tener un mínimo de 3 carracteres",
          maxlength: "El nombre no puede superar los 30 carracteres",
          required: "Debe ingresar un nombre"
        }
      }
    });


    this.systemModal = createForm3.form;
    this.validateLength3 = createForm3.validationLengths;
    this.validateMessages3 = createForm3.validationMessages;

    const createForm4 = this.createForm(["id_component", "component", "system"], {
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
        maxlength: "30",
        required: true,
        messages: {
          label: "",
          placeholder: "Componente",
          minlength: "El nombre debe tener un mínimo de 3 carracteres",
          maxlength: "El nombre no puede superar los 30 carracteres",
          required: "Debe ingresar un nombre"
        }
      },
      system: {
        minlength: "1",
        maxlength: "30",
        required: true,
        messages: {
          label: "",
          placeholder: "Sistema",
          minlength: "El nombre debe tener un mínimo de 1 carracteres",
          maxlength: "El nombre no puede superar los 30 carracteres",
          required: "Debe ingresar un nombre"
        }
      }
    });

    this.componentModal = createForm4.form;
    this.validateLength4 = createForm4.validationLengths;
    this.validateMessages4 = createForm4.validationMessages;

    const createForm5 = this.createForm(["id_activity", "activity", "component", "system", "modelo_id"], {
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
        minlength: "1",
        maxlength: "30",
        required: true,
        messages: {
          label: "",
          placeholder: "Componente",
          minlength: "El nombre debe tener un mínimo de 3 carracteres",
          maxlength: "El nombre no puede superar los 10 carracteres",
          required: "Debe ingresar un nombre"
        }},
      system: {
        minlength: "1",
        maxlength: "30",
        required: true,
        messages: {
          label: "",
          placeholder: "Sistema",
          minlength: "El nombre debe tener un mínimo de 1 caracter",
          maxlength: "El nombre no puede superar los 30 caracteres",
          required: "Debe ingresar un nombre"
        }},
      modelo_id: {
        minlength: "1",
        maxlength: "30",
        required: true,
        messages: {
          label: "",
          placeholder: "Modelo",
          minlength: "El nombre debe tener un mínimo de 1 caracter",
          maxlength: "El nombre no puede superar los 30 caracteres",
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
   * @method onOpenCreate2
   * Methodo handler lanzado al momento dar click sobre la opción de crear un modelo
   */
  onOpenCreate2() {
    this.modelModal.controls.id_model.setValue("");
    this.modelModal.controls.modelo_id.setValue("");
  }

  /**
   * @private
   * @method onOpenCreate
   * Methodo handler lanzado al momento dar click sobre la opción de crear
   */
  onOpenCreate3() {
    this.systemModal.controls.id_system.setValue("");
    this.systemModal.controls.system.setValue("");
    this.systemModal.controls.modelo_id.setValue("");
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
    this.activityModal.controls.modelo_id.setValue("");
  }

  /**
   * @private
   * @method onCreate2
   * Metodo para crear un nuevo modelo
   */
  onCreate2(){
    if (this.modelModal.valid) {
      this.modalService.dismissAll();
      this.componentsService
        .createModel({
          id: null,
          descripcion: this.modelModal.value.modelo_id
        })
        .then((resp: any) => {
          this.modelsSource.data = this.modelsSource.data.concat({
            ID: resp.id,
            Nombre: this.modelModal.value.modelo_id
          });

          // Posiciona en el tab de modelos
          this.matTabGroup.selectedIndex = 1;
        });
    }
  }

  /**
   * @private
   * @method onCreate3
   * Metodo para crear un nuevo sistema
   */
  onCreate3(){
    if (this.systemModal.valid) {
      this.modalService.dismissAll();
      this.componentsService
        .createSystem({
          id: null,
          nombre: this.systemModal.value.system,
          modelo_id: this.systemModal.value.modelo_id
        })
        .then((resp: any) => {
          this.systemsSource.data = this.systemsSource.data.concat({
            ID: resp.id,
            Nombre: this.systemModal.value.system,
            Modelo: this.systemModal.value.modelo_id
          });
          // Posiciona en el tab de sistemas
          this.matTabGroup.selectedIndex = 2;
        });
    }
  }

  /**
   * @private
   * @method onCreate4
   * Metodo para crear un nuevo compartimiento
   */
  onCreate4(){
    if (this.componentModal.valid) {
      this.modalService.dismissAll();
      this.componentsService
        .createCompartment({
          id: null,
          descripcion: this.componentModal.value.component,
          sistemas_id: this.componentModal.value.system
        })
        .then((resp: any) => {
           this.componentsSource.data = this.componentsSource.data.concat({
            ID: resp.id,
            Nombre: this.componentModal.value.component,
            Sistema: this.componentModal.value.system,
            Modelo: null
          });

          // Posiciona en el tab de compartimientos
          this.matTabGroup.selectedIndex = 3;
        });
    }
  }

  /**
   * @private
   * @method onCreate5
   * Metodo para crear una nueva actividad
   */
  onCreate5(){
    if (this.activityModal.valid) {
      this.modalService.dismissAll();
      this.componentsService
        .createActivity({
          id: null,
          descripcion: this.activityModal.value.activity,
          compartimientos_id: this.activityModal.value.component
        })
        .then((resp: any) => {
           this.activitiesSource.data = this.activitiesSource.data.concat({
            ID: resp.id,
            Nombre: this.activityModal.value.activity,
            Compartimiento: this.activityModal.value.component,
            Sistema: this.activityModal.value.system,
            Modelo: this.activityModal.value.modelo_id
          });

          // Posiciona en el tab de actividades
          this.matTabGroup.selectedIndex = 4;
        });
    }
  }

  /**
   * @private
   * @method showModel
   * Metodo para visualizar un modelo dado el identificador
  */
  showModel(id: number) {
    if(this.modelList.length > 0 && id > 0){
      return this.modelList.filter(item => item.id == id)[0].description;
    }
  } 

  /**
   * @private
   * @method showSystem
   * Metodo para visualizar un sistema dado el identificador
  */
  showSystem(id: number) {
    if(this.systemList.length > 0 && id > 0){
      return this.systemList.filter(item => item.id == id)[0].description;
    } 
  } 

  /**
   * @private
   * @method showComponent
   * Metodo para visualizar un compartimiento dado el identificador
  */
  showComponent(id: number) {
    if(this.componentList.length > 0 && id > 0){
      return this.componentList.filter(item => item.id == id)[0].description;
    }
  }
}
