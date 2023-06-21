import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Holiday } from './holiday.model';
import { set } from 'date-fns';

interface HolidayResponse  {
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
  private holidays: Holiday[] = [...this.fetchYearHollidays, ...this.nextYearHoliday];


  constructor(private http: HttpClient,) {}

  fetchYear = new Date().getFullYear();

  setHolidays(holidays: Holiday[]) {
    this.holidays = [...this.holidays, ...holidays]
  }

  fetchAllHolidays(url:string) {
    this.fetchHolidays(url);
    this.fetchNextYearHolidays(url);
    setTimeout(() => {
      this.setHolidays(this.fetchYearHollidays);
      this.setHolidays(this.nextYearHoliday);
    }
    , 1000);
  }

  fetchNextYearHolidays(url: string) {
    return this.http.get<HolidayResponse>(url + '&year=' + (this.fetchYear + 1)).subscribe((res ) => {
      console.log('res ============>', res)
      this.nextYearHoliday = res.response.holidays;
      console.log('nextYearsHolidays ============>', this.nextYearHoliday)
    });

  }

  fetchHolidays(url: string) {
    return this.http.get<HolidayResponse>(url + '&year=' + this.fetchYear).subscribe((res ) => {
      console.log('res ============>', res)
      this.fetchYearHollidays = res.response.holidays;
      console.log('fetchYearHollidays ============>', this.fetchYearHollidays)
    });

  }

  getHolidays() {
    return this.holidays.slice();
  }
}
