import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { Router } from '@angular/router';
import { OrderClass } from '@data/class/Order';
import { OrderService } from '@data/service/order.service';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class OrderListComponent implements OnInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  displayedColumns: string[] = ['id', 'consumer', 'status', 'date', 'total', 'opciones'];
  dataSource: MatTableDataSource<OrderClass> = new MatTableDataSource<OrderClass>([]);

  public orders: OrderClass[]

  constructor(
    private router: Router,
    private orderService: OrderService
  ) { }

  ngOnInit(): void {
    this.orderService.getOrders().subscribe( r => {
      if(!r.error){
        this.orders = r.data
        this.dataSource.data = this.orders
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

  onEditOrder(id: number){
    if(id == 0){
      this.router.navigate(['inicio/orders/order'])
    }else{
      this.router.navigate([`inicio/orders/order/${id}`])
    }
  }

}
