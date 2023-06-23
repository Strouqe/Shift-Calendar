import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Holiday } from '../models/holiday.model';
import { set } from 'date-fns';
// TODO alt+shift+o alphabet + unused imports 

interface HolidayResponse {
  response: {
    holidays: Holiday[];
  };
}
// TODO export interface in models folder

@Injectable({
  providedIn: 'root',
})
export class HolidaysService {
  private fetchYearHollidays: Holiday[] = [];
  private nextYearHoliday: Holiday[] = [];
  private holidays: Holiday[] = [
    ...this.fetchYearHollidays,
    ...this.nextYearHoliday,
  ]; // TODO default initialization in constructor

  constructor(
    private http: HttpClient,
  ) {}

  fetchYear = new Date().getFullYear(); // TODO variable after constructor

  setHolidays(holidays: Holiday[]) { // TODO return type
    this.holidays = [...this.holidays, ...holidays];
  }

  fetchAllHolidays(url: string) { // TODO return type
    this.fetchHolidays(url);
    this.fetchNextYearHolidays(url);
    setTimeout(() => {
      this.setHolidays(this.fetchYearHollidays);
      this.setHolidays(this.nextYearHoliday);
    }, 1000);
  }

  fetchNextYearHolidays(url: string) { // TODO return type
    return this.http
      .get<HolidayResponse>(url + '&year=' + (this.fetchYear + 1))
      .subscribe((res) => {
        this.nextYearHoliday = res.response.holidays;
      });
  }

  fetchHolidays(url: string) { // TODO return type
    return this.http
      .get<HolidayResponse>(url + '&year=' + this.fetchYear)
      .subscribe((res) => {
        this.fetchYearHollidays = res.response.holidays;
      });
  }

  getHolidays() { // TODO return type
    return this.holidays.slice();
  }
}
