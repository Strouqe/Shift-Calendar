import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, retry, throwError } from 'rxjs';
import { Holiday } from '../models/holiday.model';

interface HolidayResponse {
  response: {
    holidays: Holiday[];
  };
}

@Injectable({
  providedIn: 'root',
})
export class HolidaysService {
  private fetchYearHollidays: Holiday[] = [];
  private nextYearHoliday: Holiday[] = [];
  private holidays: Holiday[] = [
    ...this.fetchYearHollidays,
    ...this.nextYearHoliday,
  ];
  private fetchYear = new Date().getFullYear();

  constructor(private http: HttpClient) {}

  setHolidays(holidays: Holiday[]) {
    this.holidays = [...this.holidays, ...holidays];
  }

  fetchAllHolidays(url: string) {
    this.fetchHolidays(url);
    this.fetchNextYearHolidays(url);
    setTimeout(() => {
      this.setHolidays(this.fetchYearHollidays);
      this.setHolidays(this.nextYearHoliday);
    }, 1000);
  }

  fetchNextYearHolidays(url: string) {
    return this.http
      .get<HolidayResponse>(url + '&year=' + (this.fetchYear + 1))
      .subscribe((res) => {
        this.nextYearHoliday = res.response.holidays;
      });
  }

  private handleError(error: HttpErrorResponse) {
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

  fetchHolidays(url: string) {
    return this.http
      .get<HolidayResponse>(url + '&year=' + this.fetchYear)
      .pipe(retry(), catchError(this.handleError))
      .subscribe((res) => {
        this.fetchYearHollidays = res.response.holidays;
      });
  }

  getHolidays() {
    return this.holidays.slice();
  }
}
