import { Injectable } from '@angular/core';
import { ApiClass } from '@data/schema/ApiClass.class';
import { catchError, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CategoryClass } from '@data/class/Category';

@Injectable({
  providedIn: 'root'
})
export class CategoryService extends ApiClass {

  constructor(private http: HttpClient) {
    super();
  }

  getCategories(): Observable<{
    error: boolean,
    msg: string,
    data: CategoryClass[]
  }> {
    const response = {error: false, msg: '', data: null};
    return this.http.get<CategoryClass[]>(this.url + 'categories')
    .pipe(
      map( r => {
        response.data = r;
        return response;
      }),
      catchError(this.error)
    );
  }
}
