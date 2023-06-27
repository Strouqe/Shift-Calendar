import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subscription, catchError, retry, throwError } from 'rxjs';
import { Holiday, HolidayResponse } from '../models/holiday.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HolidaysService {
  fetchYear: number;
  private fetchYearHollidays: Holiday[];
  private nextYearHoliday: Holiday[];
  private holidays: Holiday[];

  constructor(private http: HttpClient) {
    this.fetchYear = new Date().getFullYear();
    this.fetchYearHollidays = [];
    this.nextYearHoliday = [];
    this.holidays = [...this.fetchYearHollidays, ...this.nextYearHoliday];
  }

  setHolidays(holidays: Holiday[]): void {
    this.holidays = [...this.holidays, ...holidays];
  }

  fetchAllHolidays(url: string): void {
    this.fetchHolidays(url);
    this.fetchNextYearHolidays(url);
    setTimeout(() => {
      this.setHolidays(this.fetchYearHollidays);
      this.setHolidays(this.nextYearHoliday);
    }, 2000);
  }

  fetchNextYearHolidays(url: string): Subscription {
    return this.http
      .get<HolidayResponse>(url + '&year=' + (this.fetchYear + 1))
      .subscribe((res) => {
        this.nextYearHoliday = res.response.holidays;
      });
  }

  fetchHolidays(url: string): Subscription {
    return this.http
      .get<HolidayResponse>(url + '&year=' + this.fetchYear)
      .subscribe((res) => {
        this.fetchYearHollidays = res.response.holidays;
      });
  }

  getHolidays(): Holiday[] {
    return this.holidays.slice();
  }


}
