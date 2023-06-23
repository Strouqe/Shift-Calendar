import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { User } from '../models/user.model';
import { ShiftService } from './shift.service';
import { Shift } from '../models/shift.model';
import { Subject, Subscription } from 'rxjs';
import { be } from 'date-fns/locale';
import { MemeService } from './meme.service';
// TODO alt+shift+o alphabet + unused imports

@Injectable({
  providedIn: 'root',
})
export class UserService implements OnInit, OnDestroy {
  userChanged = new Subject<User>();
  private user: User;
  shifts: Shift[];

  subscription: Subscription;

  constructor(
    private shiftsService: ShiftService,
    private memeService: MemeService,
    private shiftService: ShiftService // TODO unused service 
  ) {
    this.memeService.fetchMems() // TODO ;
  }

  ngOnInit(): void {
    this.subscription = this.shiftsService.shiftsChanged.subscribe(
      (shifts: Shift[]) => {
        this.shifts = shifts;
      }
    );
    this.shifts = this.shiftsService.getShifts();
  }

  autoSetUser() { // TODO return type
    if (sessionStorage.getItem('userInput')) {
      const userInput = this.getUserInput();
      this.createUser(
        userInput.name,
        userInput.gender,
        userInput.startDate,
        userInput.shiftDays,
        userInput.restDays,
        userInput.workingHours,
        userInput.imgUrl
      );
    } else {
      return;
    }
  }

  saveUserInput(
    name: string,
    gender: string,
    startDate: string,
    shiftDays: number,
    restDays: number,
    workingHours: number,
    imgUrl: string
  ) {  // TODO return type
    if (!imgUrl) {
      imgUrl = this.memeService.getMems();
    }
    sessionStorage.setItem(
      'userInput',
      JSON.stringify({
        name,
        gender,
        startDate,
        shiftDays,
        restDays,
        workingHours,
        imgUrl,
      })
    );
  }

  deleteUser() {  // TODO return type
    sessionStorage.removeItem('userInput');
  }

  getUserInput() {  // TODO return type
    if (sessionStorage.getItem('userInput')) {
      return JSON.parse(<string>sessionStorage.getItem('userInput'));
    }
  }

  setUser(user: User) {  // TODO return type
    this.user = user;
    this.userChanged.next(this.user);
  }

  getUser() {  // TODO return type
    return this.user;
  }

  createUser(
    name: string,
    gender: string,
    startDate: string,
    shiftDays: number,
    restDays: number,
    workingHours: number,
    imageUrl?: string
  ) {  // TODO return type
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
        this.shiftsService.getShifts(),
        imageUrl
      )
    );
    this.userChanged.next(this.user);
  }
  totalWorkHours(workingHours: number, shiftDays: number) {  // TODO where is a space? and I don't like function name, need to add action, GETtotalworkhours 
    return workingHours * shiftDays * this.shiftsService.getShifts().length;
  }
  totalFreeTime(restDays: number, workingHours: number, shiftDays: number) { // TODO the same problem
    let betweenWork =
      (24 - workingHours) * shiftDays * this.shiftsService.getShifts().length;
    let totalRestDays = restDays * (this.shiftsService.getShifts().length - 1);
    return betweenWork + totalRestDays * 24;
  }

  clearUser() { // TODO return type
    this.setUser(new User('', '', 0, 0, []));
    this.shiftsService.clearShifts();
    this.userChanged.next(this.user);
  }

  ngOnDestroy() {  // TODO you don't need to use on destroy in service, subscription will die, when service will die)
    this.subscription.unsubscribe();
  }
}
