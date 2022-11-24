import { Injectable } from '@angular/core';
import { ApiClass } from '@data/schema/ApiClass.class';
import { catchError, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { OrderClass } from '@data/class/Order';
import { ItemClass } from '@data/class/ItemClass';

@Injectable({
  providedIn: 'root'
})
export class OrderService extends ApiClass{

  constructor(private http: HttpClient) {
    super();
  }

  getOrders(): Observable<{
    error: boolean,
    msg: string,
    data: OrderClass[]
  }> {
    const response = {error: false, msg: '', data: null};
    return this.http.get<OrderClass[]>(this.url + 'orders')
    .pipe(
      map( r => {
        response.data = r;
        return response;
      }),
      catchError(this.error)
    );
  }

  postOrder(order: OrderClass): Observable<{
    error: boolean,
    msg: string,
    data: OrderClass
  }> {
    const response = {error: false, msg: '', data: null};
    let headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.post<any>(this.url + 'orders', JSON.stringify(order), {headers})
    .pipe(
      map( r => {
        response.data = r;
        return response;
      }),
      catchError(this.error)
    );
  }

  getItemsByOrder(idOrder: number): Observable<{
    error: boolean,
    msg: string,
    data: ItemClass[]
  }> {
    const response = {error: false, msg: '', data: null};
    return this.http.get<ItemClass[]>(this.url + `items/order/${idOrder}`)
    .pipe(
      map( r => {
        response.data = r;
        return response;
      }),
      catchError(this.error)
    );
  }

  getOrderById(idOrder: number): Observable<{
    error: boolean,
    msg: string,
    data: OrderClass
  }> {
    const response = {error: false, msg: '', data: null};
    return this.http.get<OrderClass>(this.url + `orders/${idOrder}`)
    .pipe(
      map( r => {
        response.data = r;
        return response;
      }),
      catchError(this.error)
    );
  }

  putOrder(order: OrderClass): Observable<{
    error: boolean,
    msg: string,
    data: any
  }> {
    const response = {error: false, msg: '', data: null};
    let headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.put<any>(this.url + 'orders', JSON.stringify(order), {headers})
    .pipe(
      map( r => {
        response.data = r;
        return response;
      }), catchError(this.error)
    )
  }

  postItemToOrder(item: ItemClass): Observable<{
    error: boolean,
    msg: string,
    data: ItemClass
  }> {
    const response = {error: false, msg: '', data: null};
    let headers =new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.post<ItemClass>(this.url + 'items', JSON.stringify(item), {headers})
    .pipe(
      map( r => {
        response.data = r;
        return response;
      }),
      catchError(this.error)
    )
  }

  deleteItemFromOrder(id: number): Observable<{
    error: boolean,
    msg: string,
    data: any
  }> {
    const response = {error: false, msg: '', data: null};
    return this.http.delete<any>(this.url + `items/${id}`)
    .pipe(
      map( r => {
        response.data = r;
        return response;
      }),
      catchError(this.error)
    )
  }
}
