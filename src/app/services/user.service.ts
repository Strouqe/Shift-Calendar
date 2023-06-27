import { Injectable } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { Shift } from '../models/shift.model';
import { User, UserInput } from '../models/user.model';
import { MemeService } from './meme.service';
import { ShiftService } from './shift.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  userChanged = new Subject<User>();
  memeChanged = new Subject<string>();
  shiftsSubscription: Subscription;
  memsSubscription: Subscription;
  shifts: Shift[];
  memeUrl: string;
  private user: User;

  constructor(
    private shiftsService: ShiftService,
    private memeService: MemeService,
  ) {
    this.memeUrl = "";
    this.memsSubscription = this.memeService.memeChanged.subscribe(
      (url: string) => {
        this.memeUrl = url;
        this.memeChanged.next(this.memeUrl);
      }
    );
    if(!sessionStorage.getItem('userInput')){
      this.memeService.fetchMems();
    }
    if (sessionStorage.getItem('userInput') && !this.memeUrl) {
      this.memeUrl = this.getUserInput().imgUrl;
    }
    this.shiftsSubscription = this.shiftsService.shiftsChanged.subscribe(
      (shifts: Shift[]) => {
        this.shifts = shifts;
      }
    );
    this.shifts = this.shiftsService.getShifts();
  }


  handleRefreshImage(): void {
    this.memeService.fetchMems();
  }

  autoSetUser(): void {
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
  ): void {
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

  deleteUser(): void {
    sessionStorage.removeItem('userInput');
  }

  getUserInput(): UserInput {
    return JSON.parse(<string>sessionStorage.getItem('userInput'));
  }

  setUser(user: User): void {
    this.user = user;
    this.userChanged.next(this.user);
  }

  getUser(): User {
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
  ): void {
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
        this.getTotalWorkHours(workingHours, shiftDays),
        this.getTotalFreeTime(restDays, workingHours, shiftDays),
        this.shiftsService.getShifts(),
        imageUrl ? imageUrl : this.memeUrl
      )
    );
    this.userChanged.next(this.user);
  }

  getTotalWorkHours(workingHours: number, shiftDays: number): number {
    return workingHours * shiftDays * this.shiftsService.getShifts().length;
  }

  getTotalFreeTime(restDays: number, workingHours: number, shiftDays: number): number {
    let betweenWork =
      (24 - workingHours) * shiftDays * this.shiftsService.getShifts().length;
    let totalRestDays = restDays * (this.shiftsService.getShifts().length - 1);
    return betweenWork + totalRestDays * 24;
  }

  clearUser(): void {
    this.setUser(new User('', '', 0, 0, [], ''));
    this.shiftsService.clearShifts();
    this.userChanged.next(this.user);
  }
}
