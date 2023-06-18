import { Shift } from '../calendar/shift.model';

export class User {
  public name: string;
  public gender: string;
  public totalWorkHours: number;
  public totalFreeHours: number;
  public shifts: Shift[];

  constructor(name: string, gender: string, totalWorkHours: number, totalFreeHours: number, shifts: Shift[]) {
    this.name = name;
    this.gender = gender;
    this.totalWorkHours = totalWorkHours;
    this.totalFreeHours = totalFreeHours;
    this.shifts = shifts;
  }
}
