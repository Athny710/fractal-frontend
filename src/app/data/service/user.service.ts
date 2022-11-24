import { Injectable } from '@angular/core';
import { ApiClass } from '@data/schema/ApiClass.class';
import { catchError, map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { UserClass } from '@data/class/User';

@Injectable({
  providedIn: 'root'
})
export class UserService extends ApiClass{

  constructor(private http: HttpClient) {
    super();
  }

  getUsers(): Observable<{
    error: boolean,
    msg: string,
    data: UserClass[]
  }> {
    const response = {error: false, msg: '', data: null};
    return this.http.get<UserClass[]>(this.url + 'users')
    .pipe(
      map( r => {
        response.data = r;
        return response;
      }),
      catchError(this.error)
    );
  }
}
