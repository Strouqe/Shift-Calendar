import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { User } from './user.model';
import { UserService } from './user.service';
import { formatDuration, intervalToDuration } from 'date-fns';
import { MemeService } from '../shared/meme.service';
import { GeoService } from '../shared/geo.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit {
  changedUser = new Subject<User>();
  subscription: Subscription;
  showInfo = false;
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
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.geoService.getUserCountry();
    this.subscription = this.userService.userChanged.subscribe((user: User) => {
      this.user = user;
    });

    this.userService.autoSetUser();
    if (this.user) {
      this.showInfo = true;
    }
    if (this.user) {
      this.formatValues();
    }
    console.log('user: ', this.user);
  }

  private initForm() {
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

  onSubmit() {
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

  formatValues() {
    if (this.user) {
      this.totalWorkedHours = this.splitTime(this.user.totalWorkHours);
      this.totalOffDays = this.splitTime(
        +this.user.shifts[0].restDays * (this.user.shifts.length - 1) * 24
      );
      this.totalRest = this.splitTime(this.user.totalFreeHours);
    }
  }

  onReset() {
    this.userForm.reset();
    this.userService.clearUser();
    this.showInfo = false;
    this.userService.deleteUser();
    this.memeService.fetchMems();
    this.memeService.getMems();
  }
}
