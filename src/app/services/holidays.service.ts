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
    this.holidays = [...this.fetchYearHollidays, ...this.nextYearHoliday]; // TODO: just set empty array, what's the point of this?
    // TODO: fetching of holidays should be done in constructor or by component init. There's no need to call it after geo service
  }

  setHolidays(holidays: Holiday[]): void {
    this.holidays = [...this.holidays, ...holidays];
  }

  fetchAllHolidays(userCountry: string): void {
    let url: string =
      'https://calendarific.com/api/v2/holidays?api_key=30bd35becec0c63d9b71453ffccaa74dc214c934&country=' +
      userCountry;
    this.fetchHolidays(url);
    this.fetchNextYearHolidays(url); // TODO: fetchHolidays, fetchNextYearHolidays should be observables that returns arrays of holidays. It should be awaited with Promise.all in parallel, or by rxjs merge
    setTimeout(() => {
      // TODO: setTimeout should be eliminated. You shouldn't rely on time whatever the circumstances are
      this.setHolidays(this.fetchYearHollidays); // TODO: this.holidays = [...this.fetchYearHollidays, ...this.nextYearHoliday]; that's the line that you can do with your code
      this.setHolidays(this.nextYearHoliday);
    }, 3000);
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
      .get<HolidayResponse>(url + '&year=' + this.fetchYear) // TODO; subscriptions should be eliminated, it's not a reactive way of handling things
      .subscribe((res) => {
        this.fetchYearHollidays = res.response.holidays;
      });
  }

  getHolidays(): Holiday[] {
    return this.holidays.slice();
  }
}
