import { Shift } from './shift.model';

export class User {
  constructor(
    public name: string,
    public gender: string,
    public totalWorkHours: number,
    public totalFreeHours: number,
    public shifts: Shift[],
    public imageUrl: string
  ) {}
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
