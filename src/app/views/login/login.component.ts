import { Router } from "@angular/router";
import { FormBuilder } from "@angular/forms";
import { BaseComponent } from "./../base.component";
import { Component, OnInit, Input } from "@angular/core";
import { LoginAuthService } from "../../services/auth.services";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html"
})

/**
 * @public
 * @class LoginComponent
 *
 * Clase para la vista de inicio de sesión
 */
export class LoginComponent extends BaseComponent implements OnInit {
  /**
   * @private
   * @method constructor
   */

  constructor(
    private anotherRouter: Router,
    router: Router,
    formBuilder: FormBuilder,
    public authService: LoginAuthService
  ) {
    super(router, formBuilder);
  }

  /**
   * @private
   * @method onSignIn
   * Methodo lanzado por un evento, realiza el inicio de sesión
   */
  onSignIn() {
    this.formSubmitted = true;

    if (this.form.valid) {
      this.addMask("userLogin")
      this.authService.userLogin({
       email: this.form.value.userName,
       password: this.form.value.password
      }).then(response => {
        this.navigate("dashboard");
        this.removeMask("userLogin")
      },error =>{
        console.error("Failed login");
        console.error(error);
      });
    }

    this.navigate("dashboard");
  }

  /**
   * @private
   * @method ngOnInit
   * Methodo del ciclo de vida de la vista
   */
  ngOnInit() {
    //Indicamos las reglas de los campos
    this.fieldProps = {
      userName: {
        minlength: "6",
        maxlength: "50",
        required: true,
        messages: {
          label: "",
          placeholder: "Email",
          minlength: "Correo invalido",
          maxlength: "Por favor validar longitud del correo",
          required: "Debe ingresar un correo electronico"
        }
      },
      password: {
        minlength: "2",
        maxlength: "20",
        required: true,
        messages: {
          label: "",
          placeholder: "Contraseña",
          minlength: "Contraseña demasiado corta",
          maxlength: "Por favor validar longitud de la contraseña",
          required: "Debe ingresar una contraseña"
        }
      }
    };

    super.ngOnInit();
  }

  /**
   * Método encargado de realizar la petición de login.
   * @param email     Email del usuario
   * @param password  Password del usuario
   */
  userLogin() {
    this.formSubmitted = true;
  }
}
