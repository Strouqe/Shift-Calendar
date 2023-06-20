import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GeoService } from './geo.service';

@Injectable({
  providedIn: 'root',
})
export class HolidaysService {


  constructor(private http: HttpClient, private geaoService: GeoService) {}

  getHolidays(url: string) {


    return this.http.get(url).subscribe((res) => {
      console.log('res ============>', res)
      // this.meme = res.preview[0];
      // this.memeChanged.next(this.meme);
      // console.log('meme link ============>', this.meme);
    });
  }
}
