import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import compareAsc from 'date-fns/compareAsc';
import add from 'date-fns/add';

import { Shift } from './shift.model';

@Injectable({
  providedIn: 'root',
})
export class ShiftService {
  shiftsChanged = new Subject<Shift[]>();
  private shifts: Shift[] = [];
  constructor() {}

  setShifts(shifts: Shift[]) {
    this.shifts = shifts;
    this.shiftsChanged.next(this.shifts.slice());
  }

  getShifts() {
    return this.shifts.slice();
  }

  getShift(index: number) {
    return this.shifts[index];
  }

  addShift(shift: Shift) {
    this.shifts.push(shift);
  }

  updateShift(index: number, newShift: Shift) {
    this.shifts[index] = newShift;
  }

  deleteShift(index: number) {
    this.shifts.splice(index, 1);
  }

  addDays = (date: Date, days: number): Date => {
    let result = new Date(date);
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
  ) {
    // if(new Date(startDate).getMonth() > 5){
    //   return;
    // }
    let endDate = this.addDays(new Date(startDate), shiftDays);

    let shift = new Shift(
      new Date(startDate),
      endDate,
      shiftDays,
      restDays,
      workingHours
    );

    // console.log('shift.service.startDate', startDate);
    // console.log('shift.service.shift', shift);
    let newStartDate = this.addDays(endDate, restDays)
      .toISOString()
      .split('T')[0];

    // console.log(
    //   '*========================21dwqdQD',
    //   compareAsc(add(this.shifts[0].startDate, { years: 1 }), endDate),
    //   endDate
    // );

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
}
