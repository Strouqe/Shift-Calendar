import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GeoService } from './geo.service';
import { Holiday } from './holiday.model';

interface HolidayResponse  {
  response: {
    holidays: Holiday[];
  };
}

@Injectable({
  providedIn: 'root',
})
export class HolidaysService {

  private holidays: Holiday[] = [];


  constructor(private http: HttpClient, private geaoService: GeoService) {}


  fetchHolidays(url: string) {
    return this.http.get<HolidayResponse>(url).subscribe((res ) => {
      console.log('res ============>', res)
      this.holidays = res.response.holidays;
      console.log('saved holidays ============>', this.holidays)
    });
  }

  getHolidays() {
    return this.holidays.slice();
  }
}
