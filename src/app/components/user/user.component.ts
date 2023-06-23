import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';
import { formatDuration, intervalToDuration } from 'date-fns';
import { MemeService } from '../../services/meme.service';
import { GeoService } from '../../services/geo.service';
import { HolidaysService } from '../../services/holidays.service';
import { ShiftService } from '../../services/shift.service';
// TODO alt+shift+o can help you with unused imports 
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  changedUser = new Subject<User>();
  subscription: Subscription;
  showInfo = false; // TODO default initialization should be in onInit
  user: User;
  totalWorkedHours: string;
  totalOffDays: string;
  totalRest: string;

  startDate = new Date();
  userForm: FormGroup;

  constructor(
    private userService: UserService,
    private memeService: MemeService,
    private geoService: GeoService,
    private shiftService: ShiftService,
  ) {}

  ngOnInit(): void {
    this.geoService.getCurrentLocation();
    this.initForm();
    this.subscription = this.userService.userChanged.subscribe((user: User) => { // TODO write it in one line without { }
      this.user = user;
    });

    this.userService.autoSetUser();
    if (this.user) {
      this.showInfo = true;
    }
    if (this.user) {
      this.formatValues();
    }
  }

  private initForm() { // TODO return type
    this.userForm = new FormGroup({
      userName: new FormControl(null, Validators.required),
      imageUrl: new FormControl(null),
      gender: new FormControl(null, Validators.required),
      startDate: new FormControl(this.startDate, Validators.required),
      shiftDays: new FormControl(null, Validators.required),
      restDays: new FormControl(null, Validators.required),
      workingHours: new FormControl(null, Validators.required),
    });
  }

  onSubmit() { // TODO return type
    this.userService.clearUser();
    this.userService.createUser(
      this.userForm.value.userName,
      this.userForm.value.gender,
      this.userForm.value.startDate,
      this.userForm.value.shiftDays,
      this.userForm.value.restDays,
      this.userForm.value.workingHours,
      this.userForm.value.imageUrl
        ? this.userForm.value.imageUrl
        : this.memeService.getMems()
    );
    this.userService.saveUserInput(
      this.userForm.value.userName,
      this.userForm.value.gender,
      this.userForm.value.startDate,
      this.userForm.value.shiftDays,
      this.userForm.value.restDays,
      this.userForm.value.workingHours,
      this.userForm.value.imageUrl
    );
    this.showInfo = true;
    this.formatValues();
  }

  splitTime(totalHours: number): string {
    let days = Math.floor(totalHours / 24);
    let hoursLeft = totalHours % 24;
    let hours = Math.floor(hoursLeft);
    let minuets = Math.floor((hoursLeft - hours) * 60);
    return `${days} days, ${hours} hours, ${minuets} minuets`;
  }

  formatValues() { // TODO return type
    if (this.user) {
      this.totalWorkedHours = this.splitTime(
        this.user.totalWorkHours -
          this.user.shifts[0].workingHours * this.shiftService.sumHolidays()
      );
      this.totalOffDays = this.splitTime(
        +this.user.shifts[0].restDays * (this.user.shifts.length - 1) * 24 +
          this.shiftService.sumHolidays()
      );
      this.totalRest = this.splitTime(
        this.user.totalFreeHours +
          this.shiftService.sumHolidays() * 24 -
          (24 - this.user.shifts[0].workingHours) *
            this.shiftService.sumHolidays()
      );
    }
  }

  onReset() { // TODO return type
    this.userForm.reset();
    this.userService.clearUser();
    this.showInfo = false;
    this.userService.deleteUser();
    this.memeService.fetchMems();
    this.memeService.getMems();
  }
}
