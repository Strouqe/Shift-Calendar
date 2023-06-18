import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { User } from './user.model';
import { ShiftService } from '../calendar/shift.service';
import { Shift } from '../calendar/shift.model';
import { Subject, Subscription } from 'rxjs';
import { be } from 'date-fns/locale';

@Injectable({
  providedIn: 'root',
})
export class UserService implements OnInit, OnDestroy {
  userChanged = new Subject<User>();
  private user: User;
  shifts: Shift[];

  subscription: Subscription;

  constructor(private shiftsService: ShiftService) {}

  ngOnInit(): void {
    this.subscription = this.shiftsService.shiftsChanged.subscribe(
      (shifts: Shift[]) => {
        this.shifts = shifts;
      }
    );
    this.shifts = this.shiftsService.getShifts();
  }

  autoSetUser() {
    if (sessionStorage.getItem('userInput')) {
      const userInput = this.getUserInput();
      this.createUser(userInput.name, userInput.gender, userInput.startDate, userInput.shiftDays, userInput.restDays, userInput.workingHours)
    } else {
      return;
    }
  }

  saveUserInput(name: string,
    gender: string,
    startDate: string,
    shiftDays: number,
    restDays: number,
    workingHours: number) {
    sessionStorage.setItem('userInput', JSON.stringify({name, gender, startDate, shiftDays, restDays, workingHours}));
  }

  deleteUser() {
    sessionStorage.removeItem('userInput');
  }

  getUserInput() {
    if (sessionStorage.getItem('userInput')) {
      return JSON.parse(<string>sessionStorage.getItem('userInput'));
    }
  }

  setUser(user: User) {
    this.user = user;
    this.userChanged.next(this.user);
  }

  getUser() {
    return this.user;
  }

  createUser(
    name: string,
    gender: string,
    startDate: string,
    shiftDays: number,
    restDays: number,
    workingHours: number
  ) {
    this.shiftsService.createShift(
      startDate,
      shiftDays,
      restDays,
      workingHours
    );
    this.setUser(
      new User(
        name,
        gender,
        this.totalWorkHours(workingHours, shiftDays),
        this.totalFreeTime(restDays, workingHours, shiftDays),
        this.shiftsService.getShifts()
      )
    );

    this.userChanged.next(this.user);
    console.log('user', this.user);
  }
  totalWorkHours(workingHours: number, shiftDays: number) {
    return workingHours * shiftDays * this.shiftsService.getShifts().length;
  }
  totalFreeTime(restDays: number, workingHours: number, shiftDays: number) {
    let betweenWork =
      (24 - workingHours) * shiftDays * this.shiftsService.getShifts().length;
    let totalRestDays = restDays * (this.shiftsService.getShifts().length - 1);
    return betweenWork + totalRestDays * 24;
  }

  clearUser() {
    this.setUser(new User('', '', 0, 0, []));
    this.shiftsService.clearShifts();
    this.userChanged.next(this.user);
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
