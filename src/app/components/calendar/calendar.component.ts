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
  showCalendar = false; // TODO init variables should be inside onInit

  constructor(
    private shiftsService: ShiftService,
    private userService: UserService,
    private holidayService: HolidaysService,
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.subscription = this.userService.userChanged.subscribe((user: User) => { // TODO if you have only one line here, you can write in without {} subscribe((user: User)=> this.shifts = user.shifts);
      this.shifts = user.shifts;
    });
    this.shifts = this.shiftsService.getShifts();
  }

  private initForm() { // TODO return type
    this.calendarForm = new FormGroup({
      userName: new FormControl(null, Validators.required),
      gender: new FormControl(null, Validators.required),
      startDate: new FormControl(this.startDate, Validators.required),
      shiftDays: new FormControl(null, Validators.required),
      restDays: new FormControl(null, Validators.required),
      workingHours: new FormControl(null, Validators.required),
    });
  }

  toggleCalendar() { // TODO return type
    this.showCalendar = !this.showCalendar;
  }

  dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
    const month = cellDate.getMonth(); // TODO Type
    const year = cellDate.getFullYear(); // TODO Type
    if (view === 'month') {
      for (let i = 0; i < this.holidayService.getHolidays().length; i++) {
        if (
          formatISO(cellDate, { representation: 'date' }) ==
          this.holidayService.getHolidays()[i].date.iso
        ) {
          return 'holiday';
        }
      }
      for (let i = 0; i < this.shifts.length; i++) { // TODO Type let i: number = 0;
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

  onSubmit() { // TODO return type
    this.shiftsService.setShifts([]);
    console.log(
      'startDate',
      this.calendarForm.value['startDate'].toISOString().split('T')[0]
    ); // TODO hellooo looogs
    this.shiftsService.createShift(
      this.calendarForm.value['startDate'].toISOString().split('T')[0],
      this.calendarForm.value['shiftDays'],
      this.calendarForm.value['restDays'],
      this.calendarForm.value['workingHours']
    );
    this.showCalendar = !this.showCalendar;
  }

  ngOnDestroy() { // TODO lifecycle hooks should be in the top of class after constructor, on init, on destroy after that public functions, after that private functions
    this.subscription.unsubscribe();
  }
}
