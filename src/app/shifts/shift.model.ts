
export class Shift {
  constructor(
    public startDate: Date,
    public endDate: Date,
    public shiftDays: number,
    public restDays: number,
    public workingHours: number,
    public holidays?: Date[] | number,
  ){}
}
