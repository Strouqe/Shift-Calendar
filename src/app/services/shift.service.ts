import { Injectable } from '@angular/core';
import add from 'date-fns/add';
import compareAsc from 'date-fns/compareAsc';
import { Subject } from 'rxjs';
import { Shift } from '../models/shift.model';
import { HolidaysService } from './holidays.service';
import { Holiday } from '../models/holiday.model';

@Injectable({
  providedIn: 'root',
})
export class ShiftService { // TODO: a lot of methods, but most of them unused
  shiftsChanged = new Subject<Shift[]>();
  private shifts: Shift[];

  constructor(private holidayService: HolidaysService) {
    this.shifts = [];
  }

  setShifts(shifts: Shift[]): void {
    this.shifts = shifts;
    this.shiftsChanged.next(this.shifts.slice());
  }

  getShifts(): Shift[] {
    return this.shifts.slice();
  }

  getShift(index: number): Shift {
    return this.shifts[index];
  }

  addShift(shift: Shift): void {
    this.shifts.push(shift);
  }

  updateShift(index: number, newShift: Shift): void {
    this.shifts[index] = newShift;
  }

  deleteShift(index: number): void {
    this.shifts.splice(index, 1);
  }

  clearShifts(): void {
    this.setShifts([]);
    this.shiftsChanged.next(this.shifts.slice());
  }

  createShift(
    startDate: string,
    shiftDays: number,
    restDays: number,
    workingHours: number
  ) {
    let endDate: Date = this.addDays(new Date(startDate), shiftDays);
    let holidays: Holiday[] = this.filetrHolidays(startDate, endDate);
    let newStartDate: string = this.addDays(endDate, restDays)
      .toISOString()
      .split('T')[0];
    let shift: Shift = new Shift(
      new Date(startDate),
      endDate,
      shiftDays,
      restDays,
      workingHours,
      holidays
    );
    if (this.shifts.length === 0) {
      this.shifts.push(shift);
      this.setShifts(this.shifts);
      this.createShift(newStartDate, shiftDays, restDays, workingHours);
    } else if (
      compareAsc(add(this.shifts[0].startDate, { years: 1 }), endDate) !== 1 &&
      this.shifts.length > 0 // TODO: again don't nest if's and stuff. Write them in one line, if a line starts to be large, move it to function that'll return boolean
    ) {
      return; // TODO: immediate return should be at the top of code block
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

  private addDays(date: Date, days: number): Date {
    let result: Date = new Date(date);
    result.setDate(+(result.getDate() + +days));
    return result;
  }

  private filetrHolidays(startDate: string, endDate: Date): Holiday[] {
    let holidays = this.holidayService.getHolidays().filter((holiday) => {
      return (
        compareAsc(new Date(holiday.date.iso), new Date(startDate)) !== -1 &&
        compareAsc(new Date(holiday.date.iso), endDate) === -1
      );
    });
    return holidays;
  }
}
