import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatCalendarCellClassFunction } from '@angular/material/datepicker';
import { Subscription } from 'rxjs';
import compareAsc from 'date-fns/compareAsc'

import { ShiftService } from './shift.service';
import { Shift } from './shift.model';
import { UserService } from '../user/user.service';
import { User } from '../user/user.model';


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
  showCalendar = false;

  constructor(private shiftsService: ShiftService, private userService: UserService) {}

  ngOnInit(): void {
    this.initForm();

    this.subscription = this.userService.userChanged.subscribe(
      (user: User) => {
        this.shifts = user.shifts;
      }
    );
    this.shifts = this.shiftsService.getShifts();
  }

  private initForm() {
    this.calendarForm = new FormGroup({
      userName: new FormControl(null, Validators.required),
      gender: new FormControl(null, Validators.required),
      startDate: new FormControl(this.startDate, Validators.required),
      shiftDays: new FormControl(null, Validators.required),
      restDays: new FormControl(null, Validators.required),
      workingHours: new FormControl(null, Validators.required),
    });
  }

  toggleCalendar() {
    this.showCalendar = !this.showCalendar;
  }

  dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
    const date = cellDate.getDate();
    const month = cellDate.getMonth();
    const year = cellDate.getFullYear();

    if (view === 'month') {
      for (let i = 0; i < this.shifts.length; i++) {
        if (
          year === this.shifts[i].startDate.getFullYear() &&
          month === this.shifts[i].startDate.getMonth() ||
          year === this.shifts[i].endDate.getFullYear() &&
          month === this.shifts[i].endDate.getMonth()
        ) {
          if (
            compareAsc( cellDate, this.shifts[i].startDate) >= 0 &&
            compareAsc( cellDate,this.shifts[i].endDate) < 0
          ) {
            return 'highlight';
          }
        }
      }
    }
    return '';
  };

  onSubmit() {

    this.shiftsService.setShifts([]);
    console.log(
      'startDate',
      this.calendarForm.value['startDate'].toISOString().split('T')[0]
    );
    this.shiftsService.createShift(
      this.calendarForm.value['startDate'].toISOString().split('T')[0],
      this.calendarForm.value['shiftDays'],
      this.calendarForm.value['restDays'],
      this.calendarForm.value['workingHours']
    );

      this.showCalendar = !this.showCalendar;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
