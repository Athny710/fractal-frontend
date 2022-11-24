import { Injectable } from '@angular/core';
import { ApiClass } from '@data/schema/ApiClass.class';
import { catchError, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ProductClass } from '@data/class/Product';

@Injectable({
  providedIn: 'root'
})
export class ProductService extends ApiClass{

  constructor(private http: HttpClient) {
    super();
  }

  getProducts(): Observable<{
    error: boolean,
    msg: string,
    data: ProductClass[]
  }> {
    const response = {error: false, msg: '', data: null};
    return this.http.get<ProductClass[]>(this.url + 'products')
    .pipe(
      map( r => {
        for(let i=0; i<r.length; i++){
          if(r[i].status == 1){
            r[i].status = "Habilitado"
          }else{
            r[i].status = "Deshabilitado"
          }
        }
        response.data = r;
        return response;
      }),
      catchError(this.error)
    );
  }

  postProduct(product: ProductClass): Observable<{
    error: boolean,
    msg: string,
    data: ProductClass
  }> {
    const response = {error: false, msg: '', data: null};
    let headers =new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.post<ProductClass>(this.url + 'products', JSON.stringify(product), {headers})
    .pipe(
      map( r => {
        response.data = r;
        return response;
      }),
      catchError(this.error)
    )
  }
}
