import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject, Subscription } from 'rxjs';
import { UserService } from 'src/app/services/user.service';
import { User } from '../../models/user.model';
import { GeoService } from '../../services/geo.service';
import { ShiftService } from '../../services/shift.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit, OnDestroy { // TODO: check visibility modifiers and put appropriate ones on properties and methods
  changedUser = new Subject<User>();
  changedMeme = new Subject<string>();
  subscription: Subscription;

  memeImageSubscription: Subscription;
  showInfo: boolean;
  user: User;
  totalWorkedHours: string;
  totalOffDays: string;
  totalRest: string;
  startDate: Date;
  userForm: FormGroup;
  imageUrl: string;
  memeUrl: string;

  constructor(
    private userService: UserService,
    private geoService: GeoService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.startDate = new Date();
    this.showInfo = false;
    this.geoService.getCurrentLocation();
    this.initForm();
    // this.subscription = this.userService.userChanged.subscribe((user: User) => {
    //   this.user = user;
    //   this.imageUrl = user.imageUrl!;
    //   console.log("user component user ====>", this.user)
    // });
    this.memeImageSubscription = this.userService.memeChanged.subscribe(
      (url: string) => {
        this.imageUrl = url;
      }
    );
    this.userService.autoSetUser();
  }

  handleRefreshImage(): void {
    this.userService.handleRefreshImage();
  }

  setImageUrl(url: string): void {
    this.imageUrl = url;
  }

  onSubmit(): void {
    this.userService.clearUser();
    this.userService.createUser(
      this.userForm.value.userName,
      this.userForm.value.gender,
      this.userForm.value.startDate,
      this.userForm.value.shiftDays,
      this.userForm.value.restDays,
      this.userForm.value.workingHours,
      this.userForm.value.imageUrl ? this.userForm.value.imageUrl : this.memeUrl
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
    this.setImageUrl(
      this.userForm.value.imageUrl
        ? this.userForm.value.imageUrl
        : this.userService.memeUrl
    );
    this.router.navigate(['results']);
    // this.showInfo = true;
    // this.formatValues();
  }

  splitTime(totalHours: number): string {
    let days = Math.floor(totalHours / 24);
    let hoursLeft = totalHours % 24;
    let hours = Math.floor(hoursLeft);
    let minuets = Math.floor((hoursLeft - hours) * 60);
    return `${days} days, ${hours} hours, ${minuets} minuets`;
  }

  // formatValues(): void {
  //   if (this.user) {
  //     this.totalWorkedHours = this.user.totalWorkHours.toString();
  //     this.totalOffDays = (
  //       +this.user.shifts[0].restDays * (this.user.shifts.length - 1) * 24 +
  //       this.shiftService.sumHolidays()
  //     ).toString();
  //     this.totalRest = (
  //       this.user.totalFreeHours +
  //       this.shiftService.sumHolidays() * 24 -
  //       (24 - this.user.shifts[0].workingHours) *
  //         this.shiftService.sumHolidays()
  //     ).toString();
  //   }
  // }

  onReset(): void {
    this.userForm.reset();
    this.userService.clearUser();
    this.showInfo = false;
    this.userService.deleteUser();
  }

  private initForm(): void {
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

  ngOnDestroy(): void {
    this.memeImageSubscription.unsubscribe();
  }
}
