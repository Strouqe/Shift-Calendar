import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, retry, throwError } from 'rxjs';
import { MemeResponse, ResponseData } from '../models/memeResponse.model';

@Injectable({
  providedIn: 'root',
})
export class MemeService {
  memeChanged = new BehaviorSubject<string>('');
  private url: string;

  private meme: string;

  constructor(private http: HttpClient) {
    this.url = 'https://api.imgflip.com/get_memes';
    this.meme = '';
  }

  fetchMems(): void {
     this.http.get<ResponseData>(this.url).pipe(retry(), catchError(this.handleError)).subscribe((res) => {
      this.meme = res.data.memes[Math.floor(Math.random() * 101)].url;
      this.memeChanged.next(this.meme);
      console.log('meme is loaded ============>', this.meme);
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
    return throwError(
      () => new Error('Something bad happened; please try again later.')
    );
  }
}
