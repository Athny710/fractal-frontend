import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '@data/service/order.service';
import { ItemClass } from '@data/class/ItemClass';
import { OrderClass } from '@data/class/Order';
import { ProductClass } from '@data/class/Product';
import { ProductService } from '@data/service/product.service';
import { UserClass } from '@data/class/User';
import { UserService } from '@data/service/user.service';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class OrderDetailComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['id', 'name', 'quantity', 'unitPrice', 'cost', 'opciones'];
  dataSource: MatTableDataSource<ItemClass> = new MatTableDataSource<ItemClass>([]);

  public idOrder: number = 0;
  public items: ItemClass[] = [];
  public order: OrderClass = new OrderClass;
  public openForm: Boolean = false;
  public orderForm: FormGroup;
  public products: ProductClass[] = [];
  public item: ItemClass = new ItemClass;
  public productSelected: ProductClass;

  public openFormNewOrder: Boolean = false;
  public newOrderForm: FormGroup;
  public users: UserClass[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private orderService: OrderService,
    private productService: ProductService,
    private userService: UserService
  ) {
    if(this.route.snapshot.params['id']){
      this.idOrder = +this.route.snapshot.params['id'];
    }
   }

  ngOnInit(): void {
    if(this.idOrder != 0){
      this.orderService.getOrderById(this.idOrder).subscribe( r => {
        if(!r.error){
          this.order = r.data
          this.cargarTabla();
        }
      })
    }else{
      this.items = []
      this.dataSource.data = this.items
      this.dataSource.paginator = this.paginator
      this.dataSource.sort = this.sort
      this.onOpenNewOrderForm()
      this.userService.getUsers().subscribe( r => {
        if(!r.error){
          this.users = r.data
        }
      })
    }
    this.orderForm = this.formBuilder.group({
      product:[''],
      quantity: ['']
    })
    this.newOrderForm = this.formBuilder.group({
      user: ['']
    })

  }

  cargarTabla(){
    this.orderService.getItemsByOrder(this.idOrder).subscribe( r => {
      if(!r.error){
        this.items = r.data
        this.dataSource.data = this.items
        this.dataSource.paginator = this.paginator
        this.dataSource.sort = this.sort
        this.calculateTotal();
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

  onCancel(){
    this.router.navigate(['inicio/orders'])
  }

  onEditItem(id: number){
    let itemSelectd: ItemClass = this.items.find( x =>
      x.id == id)
    this.onAddItem()
    this.item = itemSelectd
    this.productSelected = itemSelectd.product
    this.orderForm.controls['product'].setValue(itemSelectd.product.id)
    this.orderForm.controls['quantity'].setValue(itemSelectd.quantity)
  }

  onDeleteItem(id: number){
    this.orderService.deleteItemFromOrder(id).subscribe( r => {
      if(!r.error){
        this.cargarTabla();
      }
    })
  }
  calculateTotal(){
    let total: number = 0
    for(let i=0; i<this.items.length; i++){
      total = total + (this.items[i].product.price * this.items[i].quantity)
    }
    if(total != this.order.total){
      this.order.total = total
      this.orderService.postOrder(this.order).subscribe( r => {
        if(!r.error){
          this.order = r.data
        }
      })
    }
  }

  onAddItem(){
    this.item = new ItemClass
    this.productService.getProducts().subscribe( r => {
      if(!r.error){
        this.products = r.data
      }
    })
    this.openForm= true;

  }

  onCompleteOrder(){
    this.order.status = "Completed"
    this.orderService.putOrder(this.order).subscribe( r => {
      if(!r.error){
        this.router.navigate(['inicio/orders'])
      }
    })

  }

  onRejectOrder(){
    this.order.status = "Rejected"
    this.orderService.putOrder(this.order).subscribe( r => {
      if(!r.error){
        this.router.navigate(['inicio/orders'])
      }
    })
  }

  onClose(){
    this.openForm = false;
    this.orderForm.reset();
  }

  onSave(){
    if(this.productSelected.status == 'Habilitado'){
      this.productSelected.status = 1
    }else{
      this.productSelected.status = 0
    }
    this.item.product = this.productSelected

    this.item.quantity = Number(this.orderForm.value.quantity)
    this.item.order = this.order
    this.orderService.postItemToOrder(this.item).subscribe( r => {
      if(!r.error){
        this.cargarTabla()
        this.onClose()
      }
    });
  }

  onProductSelect(){
    this.productSelected = this.products.find( x =>
      x.id == this.orderForm.value.product
    )
  }

  onOpenNewOrderForm(){
    this.openFormNewOrder = true;
  }
  onSaveNewOrder(){
    let userSelected: UserClass = this.users.find( x =>
      x.id == this.newOrderForm.value.user
    )
    this.order.user = userSelected
    this.order.status = 'Pending'
    this.orderService.postOrder(this.order).subscribe( r => {
      if(!r.error){
        this.order = r.data;
        this.idOrder = this.order.id
        this.openFormNewOrder = false;
      }
    })
  }

  onCloseNewOrder(){
    this.router.navigate(['inicio/orders'])
  }
}
