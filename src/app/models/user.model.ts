import { Shift } from './shift.model';

export class User { // TODO: https://stackoverflow.com/questions/41923069/assigning-typescript-constructor-parameters unnecessary code duplication while writing a model
  public name: string;
  public gender: string;
  public totalWorkHours: number;
  public totalFreeHours: number;
  public shifts: Shift[];
  public imageUrl?: string;

  constructor(
    name: string,
    gender: string,
    totalWorkHours: number,
    totalFreeHours: number,
    shifts: Shift[],
    imageUrl: string
  ) {
    this.name = name;
    this.gender = gender;
    this.totalWorkHours = totalWorkHours;
    this.totalFreeHours = totalFreeHours;
    this.shifts = shifts;
    this.imageUrl = imageUrl;
  }
}

export interface UserInput {
  name: string;
  gender: string;
  startDate: string;
  shiftDays: number;
  restDays: number;
  workingHours: number;
  imgUrl: string;
}
