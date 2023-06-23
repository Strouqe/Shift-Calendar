import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';
import { MemeResponse } from '../models/memeResponse.model';
// TODO alt+shift+o alphabet + unused imports 
@Injectable({
  providedIn: 'root',
})
export class MemeService {
  private url = 'https://meme-api.com/gimme'; // TODO default initialization in constructor
  memeChanged = new Subject<string>();
  private meme: string;

  constructor(
    private http: HttpClient,
  ) {}

  fetchMems() { // TODO return type
    return this.http.get<MemeResponse>(this.url).subscribe((res) => {
      this.meme = res.preview[0];
      this.memeChanged.next(this.meme);
      console.log('meme is loaded ============>', this.meme);
    });
  }

  getMems() { // TODO return type
    return this.meme;
  }
}
