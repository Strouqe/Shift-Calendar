import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, retry, throwError } from 'rxjs';
import { MemeResponse, ResponseData } from '../models/memeResponse.model';

@Injectable({
  providedIn: 'root',
})
export class MemeService {
  memeChanged = new BehaviorSubject<string>(''); // TODO: should be replay subject
  private url: string;

  private meme: string;

  constructor(private http: HttpClient) {
    this.url = 'https://api.imgflip.com/get_memes'; // TODO: should be a constant on the top of the file MEME_URI = ;
    this.meme = '';
  }

  fetchMems(): void {
     this.http.get<ResponseData>(this.url).pipe(retry(), catchError(this.handleError)).subscribe((res) => {
      this.meme = res.data.memes[Math.floor(Math.random() * 101)].url;
      this.memeChanged.next(this.meme);
    });
  }

  getMems(): string {
    return this.meme;
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.status === 0) {
      console.error('An error occurred:', error.error);
    } else {
      console.error(
        `Backend returned code ${error.status}, body was: `,
        error.error
      );
    }
    // TODO: what's the point of handling an error to return an error and break the logic of the app? You don't need that kind of a error processing. If you need to log error, you can write HoF as observable and write to console an error
    return throwError(
      () => new Error('Something bad happened; please try again later.')
    );
  }
}
