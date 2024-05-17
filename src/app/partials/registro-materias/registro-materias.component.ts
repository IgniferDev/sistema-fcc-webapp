import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FacadeService } from 'src/app/services/facade.service';
import { Location } from '@angular/common';
import { MateriasService } from 'src/app/services/materias.service';
import { MatDialog } from '@angular/material/dialog';
import { EditarUserModalComponent } from 'src/app/modals/editar-user-modal/editar-user-modal.component';

//Para poder usar jquery definir esto
declare var $:any;
@Component({
  selector: 'app-registro-materias',
  templateUrl: './registro-materias.component.html',
  styleUrls: ['./registro-materias.component.scss']
})
export class RegistroMateriasComponent implements OnInit{

  @Input() rol: string = "";
  @Input() datos_user: any = {};

 //Para contraseñas
  public hide_1: boolean = false;
  public hide_2: boolean = false;
  public inputType_1: string = 'password';
  public inputType_2: string = 'password';

  public materia:any= {};
  public token: string = "";
  public errors:any={};
  public editar:boolean = false;
  public idMateria: Number = 0;

    //Check
    public valoresCheckbox: any = [];
    public dias_json: any [] = [];

    //PARA TIME PICKER DE COREUI
    time? = new Date();


    public pros: any[] = [
      {value: '1', viewValue: 'Ingenieria en Ciencias de la Computacion'},
      {value: '2', viewValue: 'Licenciatura en Ciencias de la Computacion'},
      {value: '3', viewValue: 'Ingenieria en Tecnologias de la Informacion'},
    ];
  //PARA LOS DIAS
  public dias:any[]= [
    {value: '1', nombre: 'Lunes'},
    {value: '2', nombre: 'Martes'},
    {value: '3', nombre: 'Miercoles'},
    {value: '4', nombre: 'Jueves'},
    {value: '5', nombre: 'Viernes'},
    {value: '6', nombre: 'Sabado'},
    {value: '7', nombre: 'Domingo'},
  ];

  constructor(
    private location : Location,
    private router: Router,
    public activatedRoute: ActivatedRoute,
    private dialog: MatDialog,
    private materiasService: MateriasService,
    private facadeService: FacadeService

  ){}

  ngOnInit(): void {
    if(this.activatedRoute.snapshot.params['id'] != undefined){
      this.editar = true;
      //Asignamos a nuestra variable global el valor del ID que viene por la URL
      this.idMateria = this.activatedRoute.snapshot.params['id'];
      console.log("ID Materia: ", this.idMateria);
      //Al iniciar la vista obtiene el usuario por su ID
      this.materia = this.datos_user;
    }else{
      this.materia = this.materiasService.esquemaMateria();
      this.materia.rol = this.rol;
      this.token = this.facadeService.getSessionToken();
    //El primer if valida si existe un parámetro en la URL
    }
    //Imprimir datos en consola
    console.log("Materia: ", this.materia);
    
  }

  public regresar(){
    this.location.back();
  }

  public registrar(){
    this.errors = [];
    this.errors = this.materiasService.validarMateria(this.materia, this.editar);
    if(!$.isEmptyObject(this.errors)){
      return false;
    }
    //FUNCION DE JQUERY PARA SABER SI UN ELEMENTO ESTA VACIO
      //cuando sean validados ya pasan la validacion
      this.materiasService.registrarMateria(this.materia).subscribe(
        (response)=>{
          alert("Materia Registrada Correctamente");
          console.log("Materia registrada: ", response);
          this.router.navigate(["home"]);
        },(error)=>{
          alert("No se pudo registrar materia");
          console.log(error);
        }
      );
  }

  public actualizar(){
    const dialogRef = this.dialog.open(EditarUserModalComponent,{
      data: {rol: 'materias',materia: this.materia, editar: this.editar},
      //data: {al: alumno, rol: 'alumno'}, //Se pasan valores a través del componente
      height: '288px',
      width: '328px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result.isDelete){
        console.log("Materia eliminado");
        //Recargar página
        window.location.reload();
      }else{
        alert("Materia no eliminado ");
        console.log("No se eliminó el Materia");
      }
    });
   /* //Validación
    this.errors = [];

    this.errors = this.materiasService.validarMateria(this.materia, this.editar);
    if(!$.isEmptyObject(this.errors)){
      return false;
    }
    console.log("Pasó la validación");

    this.materiasService.editarMateria(this.materia).subscribe(
      (response)=>{
        alert("Materia editado correctamente");
        console.log("Materia editado: ", response);
        //Si se editó, entonces mandar al home
        this.router.navigate(["home"]);
      }, (error)=>{
        alert("No se pudo editar el materia");
      }
    );*/

  }

  public checkboxChange(event:any){
    //console.log("Evento: ", event);
    if(event.checked){
      this.materia.dias_json.push(event.source.value)
    }else{
      console.log(event.source.value);
      this.materia.dias_json.forEach((dia, i) => {
        if(dia == event.source.value){
          this.materia.dias_json.splice(i,1)
        }
      });
    }
    console.log("Array dias: ", this.materia);
  }

  public revisarSeleccion(nombre: string){
    if(this.materia.dias_json){
      var busqueda = this.materia.dias_json.find((element)=>element==nombre);
      if(busqueda != undefined){
        return true;
      }else{
        return false;
      }
    }else{
      return false;
    }
  }

}
