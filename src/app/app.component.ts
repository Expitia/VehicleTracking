import { FormBuilder } from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import { BaseComponent } from "./views/base.component";
import { Router, NavigationEnd } from "@angular/router";
import { DeviceDetectorService } from "ngx-device-detector";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html"
})

/**
 * @public
 * @class AppComponent
 *
 * Clase para la vista de navegación principal
 */
export class AppComponent extends BaseComponent implements OnInit {
  title: string = "SAFE";
  isOpen: boolean;
  isLogin: boolean;
  isPhone: boolean;

  /**
   * @public
   * @method onOpenLink
   * Methodo handler lanzado al momento de hacer click en la navegación
   */

  onOpenLink(link) {
    this.onToggleMenu(false);
    this.navigate(link);
  }

  /**
   * @private
   * @method constructor
   */

  constructor(
    router: Router,
    private currentRouter: Router,
    formBuilder: FormBuilder,
    private deviceService: DeviceDetectorService
  ) {
    super(router, formBuilder);
  }

  /**
   * @public
   * @method ngOnInit
   * Methodo handler lanzado al momento de realizar hover sobre el panel
   */
  onToggleMenu(isOpen?: boolean) {
    this.isOpen = typeof isOpen == "boolean" ? isOpen : !this.isOpen;
  }

  /**
   * @private
   * @method ngOnInit
   * Methodo del ciclo de vida de la vista
   */

  ngOnInit() {
    this.currentRouter.routeReuseStrategy.shouldReuseRoute = function() {
      return false;
    };
    //Suscribimos el evento para saber cuando ha terminado de cargar la nueva vista
    this.currentRouter.events.subscribe(evt => {
      if (evt instanceof NavigationEnd) {
        this.currentRouter.navigated = true;
        window.scrollTo(0, 0);
        this.isLogin = this.currentRouter.url == "/";
      }
    });
    //Guardamos si la vista es de telefono o no
    this.isPhone = !this.deviceService.isDesktop();
  }
}
