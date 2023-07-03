import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, forkJoin } from 'rxjs';
import { Holiday, HolidayResponse } from '../models/holiday.model';

@Injectable({
  providedIn: 'root',
})
export class HolidaysService {
  fetchYear: number;
  holidaysChanged = new BehaviorSubject<Holiday[]>([]);
  private holidays: Holiday[];

  constructor(private http: HttpClient) {
    this.fetchYear = new Date().getFullYear();
    this.holidays = [];
  }

  fetchAllHolidays(userCountry: string): void {
    let url: string =
      'https://calendarific.com/api/v2/holidays?api_key=4c38e5dd57736f91148c49bc431e4f2ff9bdfaa7&country=' +
      userCountry;
      forkJoin([this.fetchHolidays(url), this.fetchNextYearHolidays(url)]).subscribe((res) => {
        this.holidays = [...res[0].response.holidays, ...res[1].response.holidays];
        console.log("holiday service responce",this.holidays)
        sessionStorage.setItem('holidays', JSON.stringify(this.holidays))
        this.holidaysChanged.next(this.holidays);
      })
  }

  fetchNextYearHolidays(url: string): Observable<HolidayResponse> {
    return this.http
      .get<HolidayResponse>(url + '&year=' + (this.fetchYear + 1))
  }

  fetchHolidays(url: string): Observable<HolidayResponse> {
    return this.http
      .get<HolidayResponse>(url + '&year=' + this.fetchYear)
  }


  getHolidays(): Holiday[] {
    return this.holidays;
  }
}
