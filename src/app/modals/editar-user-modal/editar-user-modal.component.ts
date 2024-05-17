import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AdministradoresService } from 'src/app/services/administradores.service';
import { AlumnosService } from 'src/app/services/alumnos.service';
import { MaestrosService } from 'src/app/services/maestros.service';
import { Router } from '@angular/router';
import { MateriasService } from 'src/app/services/materias.service';
declare var $:any;

@Component({
  selector: 'app-editar-user-modal',
  templateUrl: './editar-user-modal.component.html',
  styleUrls: ['./editar-user-modal.component.scss']
})
export class EditarUserModalComponent implements OnInit{
  public rol: string ="";

  public alumno:any={};
  public admin:any={};
  public maestro:any={};
  public materia:any={};
  public errors:any={};
  public token: string="";
  public editar:boolean=false;
  public idUser: Number=0;

  constructor(
    private administradoresService: AdministradoresService,
    private maestrosService: MaestrosService,
    private alumnosService: AlumnosService,
    private router: Router,
    private materiasService: MateriasService,
    private dialogRef: MatDialogRef<EditarUserModalComponent>,
    @Inject (MAT_DIALOG_DATA) public data: any

  ){}

  ngOnInit(): void {
    this.rol = this.data.rol;
    console.log("Rol modal: ", this.rol);

  }

  public cerrar_modal(){
    this.dialogRef.close();
    alert("Materia no editada");
  }

  public actualizarUser(){
    if(this.rol == "administrador"){
      this.errors =[];

      this.errors= this.administradoresService.validarAdmin(this.data.admin, this.data.editar);
      if(!$.isEmptyObject(this.errors)){
        return false;
      }
      console.log("Paso la validacion")

      this.administradoresService.editarAdmin(this.data.admin).subscribe(
        (response)=>{
          alert("Admistrador editado correctamente");
          console.log("Admin editado: ", response);
          this.dialogRef.close({isDelete:true});
          this.router.navigate(["home"])
        }, (error)=>{

          this.dialogRef.close();
          alert("No se pudo editar el administrador");
        }
      );

    }else if(this.rol == "maestro"){
      this.errors =[];

      this.errors= this.maestrosService.validarMaestro(this.data.maestro, this.data.editar);
      if(!$.isEmptyObject(this.errors)){
        return false;
      }
      console.log("Paso la validacion")

      this.maestrosService.editarMaestro(this.data.maestro).subscribe(
        (response)=>{
          alert("Maestro editado correctamente");
          console.log("Maestro editado: ", response);
          this.dialogRef.close({isDelete:true});
          this.router.navigate(["home"])
        }, (error)=>{

          this.dialogRef.close();
          alert("No se pudo editar el Maestro");
        }
      );

    }else if(this.rol == "alumno"){
      this.errors =[];

      this.errors= this.alumnosService.validarAlumno(this.data.alumno, this.data.editar);
      if(!$.isEmptyObject(this.errors)){
        return false;
      }
      console.log("Paso la validacion")

      this.alumnosService.editarAlumno(this.data.alumno).subscribe(
        (response)=>{
          alert("Alumno editado correctamente");
          console.log("Alumno editado: ", response);
          this.dialogRef.close({isDelete:true});
          this.router.navigate(["home"])
        }, (error)=>{

          this.dialogRef.close();
          alert("No se pudo editar el alumno");
        }
      );
    }else if(this.rol == "materias"){
      this.errors =[];

      this.errors= this.materiasService.validarMateria(this.data.materia, this.data.editar);
      if(!$.isEmptyObject(this.errors)){
        return false;
      }
      console.log("Paso la validacion")

      this.materiasService.editarMateria(this.data.materia).subscribe(
        (response)=>{
          alert("Materia editado correctamente");
          console.log("Materia editado: ", response);
          this.dialogRef.close({isDelete:true});
          this.router.navigate(["home"])
        }, (error)=>{

          this.dialogRef.close();
          alert("No se pudo editar el Materia");
        }
      );

    }
  }




  
}
