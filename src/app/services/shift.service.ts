import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import compareAsc from 'date-fns/compareAsc';
import add from 'date-fns/add';

import { Shift } from '../models/shift.model';
import { HolidaysService } from './holidays.service';
// TODO alt+shift+o alphabet + unused imports 

@Injectable({
  providedIn: 'root',
})
export class ShiftService {
  shiftsChanged = new Subject<Shift[]>();
  private shifts: Shift[] = []; // TODO where is spaces?
  constructor(
    private holidayService: HolidaysService,
  ) { }

  setShifts(shifts: Shift[]) { // TODO return type
    this.shifts = shifts;
    this.shiftsChanged.next(this.shifts.slice());
  }

  getShifts() { // TODO return type
    return this.shifts.slice();
  }

  getShift(index: number) { // TODO return type
    return this.shifts[index];
  }

  addShift(shift: Shift) { // TODO return type
    this.shifts.push(shift);
  }

  updateShift(index: number, newShift: Shift) { // TODO return type
    this.shifts[index] = newShift;
  }

  deleteShift(index: number) { // TODO return type
    this.shifts.splice(index, 1);
  }

  addDays = (date: Date, days: number): Date => { // TODO what is it and why after functions?
    let result = new Date(date); // TODO  type
    result.setDate(+(result.getDate() + +days));
    return result;
  };

  clearShifts() {
    this.setShifts([]);
    this.shiftsChanged.next(this.shifts.slice());
  }

  createShift(
    startDate: string,
    shiftDays: number,
    restDays: number,
    workingHours: number
  ) { // TODO this function is too big) please split it into some smallest 
    let endDate = this.addDays(new Date(startDate), shiftDays); // TODO type

    let holidays = this.holidayService.getHolidays().filter((holiday) => { // TODO type
      return (
        compareAsc(new Date(holiday.date.iso), new Date(startDate)) !== -1 &&
        compareAsc(new Date(holiday.date.iso), endDate) === -1
      );
    });

    let shift = new Shift( // TODO type
      new Date(startDate),
      endDate,
      shiftDays,
      restDays,
      workingHours,
      holidays
    );

    let newStartDate = this.addDays(endDate, restDays) // TODO type
      .toISOString()
      .split('T')[0];

    if (this.shifts.length === 0) {
      this.shifts.push(shift);
      this.setShifts(this.shifts);
      this.createShift(newStartDate, shiftDays, restDays, workingHours);
    } else if (
      compareAsc(add(this.shifts[0].startDate, { years: 1 }), endDate) !== 1 &&
      this.shifts.length > 0
    ) {
      return;
    } else {
      this.shifts.push(shift);
      this.setShifts(this.shifts);
      this.createShift(newStartDate, shiftDays, restDays, workingHours);
    }
  }

  sumHolidays(): number {
    let sum = 0;
    this.shifts.forEach((shift) => {
      sum += shift.holidays.length;
    });
    return sum;
  }
}
