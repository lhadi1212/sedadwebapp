import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Environment } from './Environment/environment';
import { Userinfo } from './Interfaces/userinfo';
import { Pagination } from './Interfaces/Pagination';
@Injectable({
  providedIn: 'root',
})
export class Adminservice {
  constructor(private http:HttpClient){}
GetAllUsers(pageNumber: number, pageSize: number = 2) {

    const params = new HttpParams()
      .set('pageNumber', pageNumber)
      .set('pageSize', pageSize);

    return this.http.get<Pagination<Userinfo>>(
      Environment.api + 'api/Admin/users',
      { params }
    );
  }
    DeleteAllUsers(){
   return this.http.delete<Userinfo[]>(Environment.api+'api/Admin/users')
  }
}
