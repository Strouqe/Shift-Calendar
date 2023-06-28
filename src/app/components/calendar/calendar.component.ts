import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCalendarCellClassFunction } from '@angular/material/datepicker';
import compareAsc from 'date-fns/compareAsc';
import { Subscription } from 'rxjs';

import { formatISO } from 'date-fns';
import { Shift } from '../../models/shift.model';
import { User } from '../../models/user.model';
import { HolidaysService } from '../../services/holidays.service';
import { ShiftService } from '../../services/shift.service';
import { UserService } from '../../services/user.service';

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

  constructor(
    private shiftsService: ShiftService,
    private userService: UserService,
    private holidayService: HolidaysService
  ) {}

  ngOnInit(): void {
    this.showCalendar = false;
    this.initForm();
    this.subscription = this.userService.userChanged.subscribe(
      (user: User) => (this.shifts = user.shifts) // TODO: getting shifts from user, but also getting from shift service. Should be one or another
    );
    this.shifts = this.shiftsService.getShifts();
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  toggleCalendar(): void {
    this.showCalendar = !this.showCalendar;
  }

  dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
    const month: number = cellDate.getMonth();
    const year: number = cellDate.getFullYear();
    if (view === 'month') {
      for (let i = 0; i < this.holidayService.getHolidays().length; i++) {
        if (
          formatISO(cellDate, { representation: 'date' }) ==
          this.holidayService.getHolidays()[i].date.iso
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

  onSubmit(): void {
    this.shiftsService.setShifts([]);
    this.shiftsService.createShift(
      this.calendarForm.value['startDate'].toISOString().split('T')[0],
      this.calendarForm.value['shiftDays'],
      this.calendarForm.value['restDays'],
      this.calendarForm.value['workingHours']
    );
    this.showCalendar = !this.showCalendar;
  }

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
