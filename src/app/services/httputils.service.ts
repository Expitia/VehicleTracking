import { SessionStorageService } from "angular-web-storage";
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
// import { Headers, RequestOptions } from "@angular/http";
import { EventEmitter } from "@angular/core";
import { environment } from "../../environments/environment";
import { toParseDates } from "../utils/objectsutils";

@Injectable({
  providedIn: "root"
})
export class HttputilsService {
  public invokeService$: EventEmitter<any>;

  HOST: string = environment["apiurl"];

  constructor(public http: HttpClient) {
    this.invokeService$ = new EventEmitter();
  }

  get(url: string) {
    let header = {
      "Content-Type": "application/json"
    } as any;

    if (localStorage.getItem("token"))
      header.Authorization = "Bearer " + localStorage.getItem("token");

    const headers = new HttpHeaders(header);

    let promise = new Promise((resolve, reject) => {
      this.http
        .get(this.HOST + url)
        .toPromise()
        .then(
          (res: any) => {
            this.invokeService$.emit(true);
            resolve(toParseDates(res));
          },
          (msg: any) => {
            this.invokeService$.emit(false);
            reject(this.builderror());
          }
        );
    });

    return promise;
  }

  loginPost(url: string, body: any) {
    const headers = new HttpHeaders({
      "Content-Type": "application/x-www-form-urlencoded"
    });

    return new Promise((resolve, reject) => {
      this.http
        .post(this.HOST + url, JSON.stringify(body), { headers })
        .toPromise()
        .then(
          (res: any) => {
            this.invokeService$.emit(true);
            localStorage.setItem("token", res.jwt);
            resolve(toParseDates(res));
          },
          (msg: any) => {
            this.invokeService$.emit(false);
            reject(this.builderror());
          }
        );
    });
  }

  post(url: string, body: any) {
    let header = {
      "Content-Type": "application/json"
    } as any;

    if (localStorage.getItem("token"))
      header.Authorization = "Bearer " + localStorage.getItem("token");

    const headers = new HttpHeaders(header);

    return new Promise((resolve, reject) => {
      this.http
        .post(this.HOST + url, JSON.stringify(body), { headers })
        .toPromise()
        .then(
          (res: any) => {
            this.invokeService$.emit(true);
            resolve(toParseDates(res));
          },
          (msg: any) => {
            this.invokeService$.emit(false);
            reject(this.builderror());
          }
        );
    });
  }

  builderror(message?: string) {
    this.invokeService$.emit(false);
    return {
      validations: [
        {
          code: "SYS-ERR",
          description: message || "Failed to execute the request"
        }
      ]
    };
  }
}
