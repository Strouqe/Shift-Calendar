import { Injectable } from '@angular/core';
import { UserInput } from '../models/user.model';
import { Holiday } from '../models/holiday.model';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor() {}

  saveUser(
    name: string,
    gender: string,
    startDate: string,
    shiftDays: number,
    restDays: number,
    workingHours: number,
    imgUrl: string
  ) {
    sessionStorage.setItem(
      // TODO: service for sessionStorage could be created to manipulate the storage
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
  getUserInput(): UserInput {
    return JSON.parse(<string>sessionStorage.getItem('userInput'));
  }

  setHolidays(holidays: Holiday[]) {
    sessionStorage.setItem('holidays', JSON.stringify(holidays));
  }

  getHolidays(): Holiday[] {
    return JSON.parse(<string>sessionStorage.getItem('holidays'));
  }

  clearStorage() {
    sessionStorage.clear();
  }
}
