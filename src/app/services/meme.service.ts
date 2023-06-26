import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, catchError, retry, take, throwError } from 'rxjs';
import { MemeResponse } from '../models/memeResponse.model';

@Injectable({
  providedIn: 'root',
})
export class MemeService {
  memeChanged = new BehaviorSubject<string>('');
  private url: string;
  private meme: string;

  constructor(private http: HttpClient) {
    this.url = 'https://meme-api.com/gimme';
    this.meme = '';
  }

  fetchMems(): void {
     this.http.get<MemeResponse>(this.url).pipe(retry(), catchError(this.handleError)).subscribe((res) => {
      this.meme = res.preview[0];
      this.memeChanged.next(this.meme);
      console.log('meme is loaded ============>', this.meme);
    });
    // this.memeChanged.next((+new Date * Math.random()).toString(36).substring(0,6));
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
