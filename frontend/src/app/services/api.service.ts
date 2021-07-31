import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment as env } from 'src/environments/environment';
import { User } from '../interfaces/user';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Todo } from '../interfaces/todo';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient
  ) { }

  //######### auth

  register(user: User) {
    return this.http.post(`${env.url}/auth/register`, {
      userName: user.userName,
      email: user.email,
      password: user.password,
    })
  }

  login(email: string, password: string) {
    return this.http.post(`${env.url}/auth/login`, {
      email,
      password
    })
  }

  postRefresh(refresh: any) {
    return this.http.post(`${env.url}/auth/refresh`, {},
      {
        params: {
          refreshToken: refresh
        }
      })
  }


  //## data
  getTodos(userid: any) {
    return this.http.get(`${env.url}/api/todos/${userid}`)
  }

  deletetodo(id) {
    console.log(id)
    return this.http.delete(`${env.url}/api/todos/delete/${id}`).pipe(catchError(err => {
      return throwError(err)
    }))
  }

  addTodo(todo) {
    return this.http.post(`${env.url}/api/todos/add`, todo)
  }

  update(todo: Todo) {
    return this.http.patch(`${env.url}/api/todos/update/${todo._id}`, todo)
  }
}
