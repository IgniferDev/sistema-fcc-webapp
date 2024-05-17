import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ValidatorService } from './tools/validator.service';
import { ErrorsService } from './tools/errors.service';
import { Observable, map } from 'rxjs';
import { environment } from '../../environments/environment';
import { FacadeService } from './facade.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class MateriasService {

  constructor(
    private http: HttpClient,
    private validatorService: ValidatorService,
    private errorService: ErrorsService,
    private facadeService: FacadeService
  ) { }

  public esquemaMateria(){
    return {
      'rol':'',
      'nrc':'',
      'nombre_materia': '',
      'seccion': '',
      'dias_json': [],
      'horai': '',
      'horaf': '',
      'salon': '',
      'programa_educativo': ''
    }
  }

  //Validación para el formulario
  public validarMateria(data: any, editar: boolean){
    console.log("Validando materia... ", data);
    let error: any = [];

    if(!this.validatorService.required(data["nrc"])){
      error["nrc"] = this.errorService.required;
    }

    if(!this.validatorService.required(data["nombre_materia"])){
      error["nombre_materia"] = this.errorService.required;
    }

    if(!this.validatorService.required(data["seccion"])){
      error["seccion"] = this.errorService.required;
    }

    if(data["dias_json"].length == 0){
      error["dias_json"] = "Al menos debes elegir un dia";
      //alert("Debes seleccionar materias para poder registrarte.");
    }

    if(!this.validatorService.required(data["horai"])){
      error["horai"] = this.errorService.required; 
    }

    if(!this.validatorService.required(data["horaf"])){
      error["horaf"] = this.errorService.required; 
    }

    if(!this.validatorService.required(data["salon"])){
      error["salon"] = this.errorService.required;
    }

    if(!this.validatorService.required(data["programa_educativo"])){
      error["programa_educativo"] = this.errorService.required;
    }
    //Return arreglo
    return error;
  }

  public registrarMateria(data:any): Observable <any>{
    return this.http.post<any>(`${environment.url_api}/materias/`, data, httpOptions);
  }

  public obtenerListaMaterias (): Observable <any>{
    var token = this.facadeService.getSessionToken();
    var headers = new HttpHeaders({ 'Content-Type': 'application/json' , 'Authorization': 'Bearer '+token});
    return this.http.get<any>(`${environment.url_api}/lista-materias/`, {headers:headers});
  }

//Eliminar Maestro
  public eliminarMateria(idMateria: number): Observable <any>{
    var token = this.facadeService.getSessionToken();
    var headers = new HttpHeaders({ 'Content-Type': 'application/json' , 'Authorization': 'Bearer '+token});
    return this.http.delete<any>(`${environment.url_api}/materias-edit/?id=${idMateria}`,{headers:headers});
  }

//Obtener un solo maestro dependiendo su ID
  public getMateriaByID(idUser: Number){
    return this.http.get<any>(`${environment.url_api}/materias/?id=${idUser}`,httpOptions);
  }


  //Servicio para actualizar un usuario
  public editarMateria (data: any): Observable <any>{
    var token = this.facadeService.getSessionToken();
    var headers = new HttpHeaders({ 'Content-Type': 'application/json' , 'Authorization': 'Bearer '+token});
    return this.http.put<any>(`${environment.url_api}/materias-edit/`, data, {headers:headers});
  }

  //DATA PARA GRAFICAS
  public countDomingo(){
    var token = this.facadeService.getSessionToken();
    var headers = new HttpHeaders({ 'Content-Type': 'application/json' , 'Authorization': 'Bearer '+token});
    return this.http.get<any>(`${environment.url_api}/materias-edit/`, {headers:headers});
  }
  public countLunes(data:any): Observable <any>{
    return this.http.post<any>(`${environment.url_api}/materias/`, data, httpOptions);
  }
  public countMartes(data:any): Observable <any>{
    return this.http.post<any>(`${environment.url_api}/materias/`, data, httpOptions);
  }


}
