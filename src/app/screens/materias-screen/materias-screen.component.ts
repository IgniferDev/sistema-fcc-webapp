import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { EliminarUserModalComponent } from 'src/app/modals/eliminar-user-modal/eliminar-user-modal.component';
import { FacadeService } from 'src/app/services/facade.service';
import { MateriasService } from 'src/app/services/materias.service';

@Component({
  selector: 'app-materias-screen',
  templateUrl: './materias-screen.component.html',
  styleUrls: ['./materias-screen.component.scss']
})
export class MateriasScreenComponent implements OnInit {

  public name_user:string = "";
  public rol:string = "";
  public token : string = "";
  public lista_materias: any[] = [];

  //Para la tabla
  displayedColumns: string[] = ['nrc', 'nombre_materia', 'seccion', 'dias_json', 'horai', 'horaf', 'salon', 'programa_educativo','editar', 'eliminar'];
  //displayedColumns2: string[] = ['nrc', 'nombre_materia', 'seccion', 'dias_json', 'horai', 'horaf', 'salon', 'programa_educativo'];
  dataSource = new MatTableDataSource<DatosUsuario>(this.lista_materias as DatosUsuario[]);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  constructor(
    public facadeService: FacadeService,
    public materiasService: MateriasService,
    private router: Router,
    public dialog: MatDialog
  ){
  }

  ngOnInit(): void {
    this.name_user = this.facadeService.getUserCompleteName();
    this.rol = this.facadeService.getUserGroup();
    //Validar que haya inicio de sesión
    //Obtengo el token del login
    this.token = this.facadeService.getSessionToken();
    console.log("Token: ", this.token);
    if(this.token == ""){
      this.router.navigate([""]);
    }
    //Obtener materias
    this.obtenerMaterias();
    //Para paginador
    this.initPaginator();
  }

  public obtenerMaterias(){
    this.materiasService.obtenerListaMaterias().subscribe(
      (response)=>{
        this.lista_materias = response;
        console.log("Lista materias: ", this.lista_materias);
        if(this.lista_materias.length > 0){
          //Agregar datos del nombre e email
          
          console.log("Materias: ", this.lista_materias);

          this.dataSource = new MatTableDataSource<DatosUsuario>(this.lista_materias as DatosUsuario[]);
        }
      }, (error)=>{
        alert("No se pudo obtener la lista de materias");
      }
    );
  }

  //Para paginación
  public initPaginator(){
    setTimeout(() => {
      this.dataSource.paginator = this.paginator;
      //console.log("Paginator: ", this.dataSourceIngresos.paginator);
      //Modificar etiquetas del paginador a español
      this.paginator._intl.itemsPerPageLabel = 'Registros por página';
      this.paginator._intl.getRangeLabel = (page: number, pageSize: number, length: number) => {
        if (length === 0 || pageSize === 0) {
          return `0 / ${length}`;
        }
        length = Math.max(length, 0);
        const startIndex = page * pageSize;
        const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
        return `${startIndex + 1} - ${endIndex} de ${length}`;
      };
      this.paginator._intl.firstPageLabel = 'Primera página';
      this.paginator._intl.lastPageLabel = 'Última página';
      this.paginator._intl.previousPageLabel = 'Página anterior';
      this.paginator._intl.nextPageLabel = 'Página siguiente';
    },500);
    //this.dataSourceIngresos.paginator = this.paginator;
  }

  public delete(idMateria: number){
    const dialogRef = this.dialog.open(EliminarUserModalComponent,{
      data: {id: idMateria, rol: 'materias'}, //Se pasan valores a través del componente
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
        console.log("No se eliminó el materia");
      }
    });
  }

 //Funcion para editar
  public goEditar(idUser: number){
    this.router.navigate(["registro-usuarios/materias/"+idUser]);
  }

  





  
}

export interface DatosUsuario {
  id: number,
  nrc:string,
  nombre_materia: string,
  seccion: string,
  dias_json: string,
  horai: string,
  horaf: string,
  salon: string,
  programa_educativo: string

}


