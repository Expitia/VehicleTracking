import { Router } from "@angular/router";
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder
} from "@angular/forms";

/**
 * @public
 * @class LoginComponent
 *
 * Clase para el comportamiento generico de las vistas
 */
export class BaseComponent {
  /**
   * @property {boolean} errors
   * Indica si se presenta errores en el formulario
   */
  errors: boolean;

  /**
   * @property {FormGroup} from
   * Formulario de la vista
   */
  form: FormGroup;

  /**
   * @property {boolean} isLogged
   * Indica si el usuario tiene la sesión iniciada
   */
  isLogged: boolean;

  /**
   * @property {boolean} formSubmitted
   * Indica si el formulario ha sido enviado
   */
  formSubmitted: boolean;

  /**
   * @property {boolean} formSubmitted
   * Objeto con las validaciones de longitud para el formulario
   */
  validationLengths: any;

  /**
   * @property {Object} validationMessages
   * Objetos con los mensajes de validación
   */
  validationMessages: Object;

  /**
   * @property {Object} fieldProps
   * Lista de propiedades para los campos para el formulario
   */
  fieldProps: Object;

  /**
   * @property {boolean} loading
   * booleano que indica si se debe visualizar una mascara
   */
  loading: boolean = false;

  /**
   * @property {Object} masks
   * Objeto con la lista de mascaras
   */
  masks: Object = {};

  /**
   * @private
   * @method constructor
   */

  constructor(protected router: Router, protected formBuilder: FormBuilder) {
    //Indicamos que no existen errores en la forma
    this.errors = false;
    //Indicamos que el formulario no se envia
    this.formSubmitted = false;
  }

  /**
   * @private
   * @method addMask
   * Methodo para la activación de mascaras
   */
  addMask = (id: string) => {
    this.masks[id] = true;
    this.loading = true;
  };

  /**
   * @private
   * @method removeMask
   * Methodo para la eliminación de mascaras
   */
  removeMask = (id: string) => {
    this.masks[id] = false;
    this.loading = true;
    for (let key in this.masks) {
      if (!this.masks[key]) {
        this.loading = false;
      }
    }
  };

  /**
   * @private
   * @method navigate
   * Methodo para la navegación entre vistas
   */
  navigate = (page, data?: any) => {
    data ? this.router.navigate(page, data) : this.router.navigateByUrl(page);
  };

  /**
   * @private
   * @method ngOnInit
   * Methodo del ciclo de vida de la vista
   */
  ngOnInit() {
    let fields = Object.keys(this.fieldProps);

    if (fields) {
      this.form = this.createForm(fields, this.fieldProps).form;
    }
  }

  /**
   * @private
   * @method createForm
   * Methodo para la creación de formularios con respecto a la configuración
   * @param {Array}   properties Arreglo con las propiedades del formulario
   * @param {Object}  fieldProps Objeto con las configuraciones
   */

  createForm(properties?: Array<string>, fieldProps?: Object) {
    //Obtenemos la configuración de los campos
    let fieldsConfig = {};
    //Inicializamos los mensajes de validación
    this.validationMessages = {};
    //Inicializamos la validación de longitud
    this.validationLengths = {};

    properties.map(field => {
      //Agregamos las validaciones de los campos
      fieldsConfig[field] = fieldProps[field].value || [
        "",
        this.getValidator(fieldProps[field])
      ];
      if (!fieldsConfig[field].basicData) {
        //Agregamos sus mensajes de error
        this.validationMessages[field] = fieldProps[field].messages;
        //Agregamos las validaciones de longitud
        this.validationLengths[field] = {
          maxLength: fieldProps[field].maxlength,
          minLength: fieldProps[field].minlength
        };
      }
    });
    //Creamos las reglas del formulario
    return {
      form: this.formBuilder.group(fieldsConfig),
      validationMessages: this.validationMessages,
      validationLengths: this.validationLengths
    };
  }

  /**
   * @private
   * @method getValidator
   * Methodo para que obtiene el arreglo de validaciones con respecto a la configuración
   * @param {Object} fieldProps Objetos con la infomación de validaciones
   */

  getValidator(fieldProps: Object) {
    //Creamos el arreglo de validaciones
    let validators = [];
    //En caso de ser requerido el campo agregamos la validación
    if (fieldProps["required"] == true) {
      validators.push(Validators.required);
    }
    //En caso de tener un valor minimo agregamos la validación
    if (fieldProps["minlength"]) {
      validators.push(Validators.minLength(fieldProps["minlength"]));
    }
    //En caso de tener un valor maximo agregamos la validación
    if (fieldProps["maxlength"]) {
      validators.push(Validators.maxLength(fieldProps["maxlength"]));
    }
    return validators;
  }

  /**
   * @private
   * @method showValidations
   * Methodo para que visualiza los errores en los campos
   * @param {Object} form   Formulario para obtener las validaciones
   * @param {Array}  fields Lista de campos del formulario
   *
   * @return {Object} Objeto con las validaciones y controles activos
   */

  showValidations(form?: any, fields?: Array<string>) {
    let found = "",
      evalForm = form || this.form,
      formFields = fields || Object.keys(this.fieldProps);

    for (let i = 0; i < formFields.length; i++) {
      if (
        evalForm.controls[formFields[i]].errors &&
        evalForm.controls[formFields[i]].errors.required &&
        evalForm.controls[formFields[i]]["invalid"] == true
      ) {
        found = formFields[i];
        i = formFields.length + 1;
      }
    }

    for (let i = 0; i < formFields.length; i++) {
      if (formFields[i] == found) {
        evalForm.controls[formFields[i]]["active"] = true;
      } else {
        evalForm.controls[formFields[i]]["active"] = false;
      }
    }

    if (form) return evalForm;
  }
}
