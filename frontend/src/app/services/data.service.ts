import { Injectable } from '@angular/core';
import { User } from '../interfaces/user';
import { ApiService } from './api.service';
import { Storage } from '@ionic/storage-angular';
import { take, catchError } from 'rxjs/operators';
import { NavController, ToastController } from '@ionic/angular';
import { from, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { Todo } from '../interfaces/todo';

const USER = 'user'
const ACCESS_TOKEN = 'accessToken'
const REFRESH_TOKEN = 'refreshToken'

@Injectable({
  providedIn: 'root'
})
export class DataService {

  user: User;
  accessToken;
  refreshToken: string;
  todos: Todo[] = [];
  private navParams: any = {};

  constructor(
    private api: ApiService,
    private storage: Storage,
    private navCtrl: NavController,
    private toastCtrl: ToastController
  ) {
    // this.getAccessTokens();
  }

  getParams() {
    return this.navParams;
  }

  setParams(body) {
    this.navParams = body;
  }


  register(user: User) {
    this.api.register(user).pipe(
      take(1)
      , catchError(async (err) => {
        if (err instanceof HttpErrorResponse) {
          let toast = await this.toastCtrl.create({
            message: err.error.message,
            duration: 2000
          })
          toast.present();
          throwError(err.error.message);
        } else {
          let toast = await this.toastCtrl.create({
            message: err,
            duration: 2000
          })
          toast.present();
          throwError(err);
        }
      })
    ).subscribe(async (res: any) => {
      if (!res) {
        console.log('faleed')
      }
      else {
        await this.storage.set(USER, res.user)
        await this.storage.set(ACCESS_TOKEN, res.accessToken)
        await this.storage.set(REFRESH_TOKEN, res.refreshToken)

        localStorage.setItem(ACCESS_TOKEN, res.accessToken);

        await this.getTokens().then(() => {
          this.navCtrl.navigateForward('home')
        })
      }
    })
  }

  async login(email: string, password: string) {
    this.api.login(email, password).pipe(
      take(1)).pipe(
        catchError(async (err) => {
          if (err instanceof HttpErrorResponse) {
            let toast = await this.toastCtrl.create({
              message: err.error.message,
              duration: 2000
            })
            toast.present();
            throwError(err.error.message);
          } else {
            let toast = await this.toastCtrl.create({
              message: err,
              duration: 2000
            })
            toast.present();
            throwError(err);
          }
        })
      )
      .subscribe(async (res: any) => {
        if (!res) {
          console.log('faleed')
        }
        else {
          await this.storage.set(USER, res.user)
          await this.storage.set(ACCESS_TOKEN, res.accessToken)
          await this.storage.set(REFRESH_TOKEN, res.refreshToken)

          localStorage.setItem(ACCESS_TOKEN, res.accessToken);

          await this.getTokens().then(() => {
            this.navCtrl.navigateForward('home')
          })
        }
      })
  }


  async getTokens() {
    // this.accessToken = await this.storage.get(ACCESS_TOKEN);
    this.accessToken = localStorage.getItem(ACCESS_TOKEN);
    this.refreshToken = await this.storage.get(REFRESH_TOKEN);
    this.user = await this.storage.get(USER)
    // if (!this.userdata) this.isAuth.next(false)
    console.log(this.accessToken, this.refreshToken, this.user)
  }

  async getAccessTokens() {
    this.accessToken = await this.storage.get(ACCESS_TOKEN);
  }

  getNewAccess() {
    let promise = new Promise(async (resolve, reject) => {
      let refresh = await this.storage.get(REFRESH_TOKEN);
      return this.api.postRefresh(refresh).pipe(take(1)).subscribe(async (res: any) => {
        localStorage.setItem(ACCESS_TOKEN, res.accessToken)
        this.storage.set(ACCESS_TOKEN, res.accessToken),
          this.storage.set(REFRESH_TOKEN, res.refreshToken)
        resolve(res.accessToken)
      },
        (e: any) => reject(e)
      )
    })
    return from(promise)
  }


  async logOut() {
    return await this.storage.clear().then(() => {
      this.navCtrl.navigateBack('/login')
    });
  }




  // todos

  async gettodos() {

    let userdata = await this.storage.get(USER);
    this.api.getTodos(userdata?._id).subscribe(async (res: any) => {

      this.todos.push(...res);

      return this.todos;
    })
  }

  deletetodo(todo: Todo, index: number) {
    this.todos.splice(index, 1);
    this.api.deletetodo(todo._id).subscribe()
  }

  addTodo(todo: Todo) {
    let data = {
      title: todo.title,
      desc: todo.desc,
      userId: this.user._id
    }

    this.api.addTodo(data).subscribe(async (res: any) => {
      this.todos.push(res);
      this.navCtrl.navigateBack('home')
    })
  }

  update(todo: Todo) {
    return this.api.update(todo)
  }


}
