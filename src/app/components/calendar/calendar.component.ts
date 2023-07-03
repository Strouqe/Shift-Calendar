import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCalendarCellClassFunction } from '@angular/material/datepicker';
import compareAsc from 'date-fns/compareAsc';
import { Subscription } from 'rxjs';

import { formatISO } from 'date-fns';
import { Shift } from '../../models/shift.model';
import { HolidaysService } from '../../services/holidays.service';
import { ShiftService } from '../../services/shift.service';
import { Holiday } from 'src/app/models/holiday.model';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CalendarComponent implements OnInit, OnDestroy {
  shifts: Shift[];
  subscription: Subscription;
  startDate = new Date();
  calendarForm: FormGroup;
  showCalendar: boolean;
  holidays: Holiday[];
  holidaySubscription: Subscription;

  constructor(
    private shiftsService: ShiftService,
    private holidayService: HolidaysService,
    private strorageService: StorageService
  ) {}

  ngOnInit(): void {
    this.showCalendar = false;
    this.initForm();
    this.shifts = this.shiftsService.getShifts();
    this.holidays = this.strorageService.getHolidays();
    this.holidaySubscription = this.holidayService.holidaysChanged.subscribe(
      () => {
        this.holidays = this.strorageService.getHolidays();
      }
    );
  }

  ngOnDestroy(): void {
    this.holidaySubscription.unsubscribe();
  }

  toggleCalendar(): void {
    this.showCalendar = !this.showCalendar;
  }

  dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
    const month: number = cellDate.getMonth();
    const year: number = cellDate.getFullYear();
    if (view === 'month') {
      for (let i = 0; i < this.holidays.length; i++) {
        if (
          formatISO(cellDate, { representation: 'date' }) ==
          this.holidays[i].date.iso
        ) {
          return 'holiday';
        }
      }
      for (let i: number = 0; i < this.shifts.length; i++) {
        if (
          (year === this.shifts[i].startDate.getFullYear() &&
            month === this.shifts[i].startDate.getMonth()) ||
          (year === this.shifts[i].endDate.getFullYear() &&
            month === this.shifts[i].endDate.getMonth())
        ) {
          if (
            compareAsc(cellDate, this.shifts[i].startDate) >= 0 &&
            compareAsc(cellDate, this.shifts[i].endDate) < 0
          ) {
            return 'highlight';
          }
        }
      }
    }
    return '';
  };

  private initForm(): void {
    this.calendarForm = new FormGroup({
      userName: new FormControl(null, Validators.required),
      gender: new FormControl(null, Validators.required),
      startDate: new FormControl(this.startDate, Validators.required),
      shiftDays: new FormControl(null, Validators.required),
      restDays: new FormControl(null, Validators.required),
      workingHours: new FormControl(null, Validators.required),
    });
  }
}
