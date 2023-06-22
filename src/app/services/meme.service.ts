import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';
import { MemeResponse } from '../models/memeResponse.model';

@Injectable({
  providedIn: 'root',
})
export class MemeService {
  private url = 'https://meme-api.com/gimme';
  memeChanged = new Subject<string>();
  private meme: string;

  constructor(private http: HttpClient) {}

  fetchMems() {
    return this.http.get<MemeResponse>(this.url).subscribe((res) => {
      this.meme = res.preview[0];
      this.memeChanged.next(this.meme);
      console.log('meme link ============>', this.meme);
    });
  }

  getMems() {
    return this.meme;
  }
}
