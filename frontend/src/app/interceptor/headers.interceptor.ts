import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { EMPTY, Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { DataService } from '../services/data.service';


@Injectable({
  providedIn: 'root'
})
export class HeadersInterceptor implements HttpInterceptor {

  constructor(
    private dataService: DataService
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.includes("https://to-do-list-one.herokuapp.com/auth")) {
      console.log('this auth');
      return next.handle(req);
    }
    // console.log(req, next)
    return this.addToken(req, next).pipe(
      catchError((err) => {
        if (err instanceof HttpErrorResponse) {
          switch (err.status) {
            case 400: // access token expired
              return this.handelError400(req, next)

            case 401: //refresh token failed
              return this.handelError401();

            default:
              return throwError(err)
          }
        } else {
          return throwError(err)
        }
      })
    )
  }

  addToken(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let request = req.clone({
      setHeaders: {
        Authorization: 'Bearer ' + this.dataService.accessToken
      }
    })
    console.log(this.dataService.accessToken)
    console.log(request)
    return next.handle(request)
  }

  handelError400(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return this.dataService.getNewAccess().pipe(
      switchMap(() => {
        return this.addToken(req, next)
      })
    )
  }

  handelError401() {
    this.dataService.logOut();
    return EMPTY
  }

}
