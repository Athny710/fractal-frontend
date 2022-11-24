import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { CategoryClass } from '@data/class/Category';
import { ProductClass } from '@data/class/Product';
import { CategoryService } from '@data/service/category.service';
import { ProductService } from '@data/service/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class ProductListComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['id', 'name', 'price', 'status', 'category', 'opciones'];
  dataSource: MatTableDataSource<ProductClass> = new MatTableDataSource<ProductClass>([]);

  public products: ProductClass[]
  public product: ProductClass
  public categories: CategoryClass[]
  private categorySelected: CategoryClass

  public productForm: FormGroup

  public openForm: Boolean = false;


  constructor(
    private productService: ProductService,
    private categoryService: CategoryService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.productForm = this.formBuilder.group({
      name: [''],
      price: [''],
      category: [''],
      status: ['']
    })
    this.cargarTabla()
    this.categoryService.getCategories().subscribe( r => {
      if(!r.error){
        this.categories = r.data
      }
    })
  }

  cargarTabla(){
    this.productService.getProducts().subscribe( r => {
      if(!r.error){
        this.products = r.data;
        this.dataSource.data = this.products
        this.dataSource.paginator = this.paginator
        this.dataSource.sort = this.sort
      }
    })
  }

  filtrarTabla(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if(this.dataSource.paginator){
      this.dataSource.paginator.firstPage()
    }
  }

  onEditProduct(id: number){
    if(id == 0){
      this.product = new ProductClass
    }else{
      this.product = this.products.find( x =>
        x.id == id
      )
      this.productForm.controls['name'].setValue(this.product.name)
      this.productForm.controls['price'].setValue(this.product.price)
      this.productForm.controls['category'].setValue(this.product.category.id)
      this.categorySelected = this.product.category
      if(this.product.status == 'Habilitado'){
        this.productForm.controls['status'].setValue(1)
      }else{
        this.productForm.controls['status'].setValue(0)
      }
    }
    this.openForm = true;
  }

  onCancelar(){
    this.openForm = false;
    this.productForm.reset();
  }

  onSave(){
    this.product.name = this.productForm.value.name;
    this.product.price = Number(this.productForm.value.price);
    this.product.category = this.categorySelected
    this.product.status = Number(this.productForm.value.status)

    this.productService.postProduct(this.product).subscribe( r => {
      if(!r.error){
        this.cargarTabla()
        this.onCancelar();
      }
    })
  }

  onCategorySelected(){
    this.categorySelected = this.categories.find( x =>
      x.id == this.productForm.value.category
    )
  }

}
