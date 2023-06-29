import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { ShiftService } from 'src/app/services/shift.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss'],
})
export class UserInfoComponent implements OnInit, OnDestroy {
  userSubscription: Subscription;
  memeImageSubscription: Subscription;

  user: User;
  imageUrl: string;
  memeUrl: string;
  totalWorkedHours: string;
  totalOffDays: string;
  totalRest: string;

  constructor(
    private userService: UserService,
    private shiftService: ShiftService,
  ) {}

  ngOnInit(): void {
    this.userSubscription = this.userService.userChanged.subscribe(
      (user: User) => {
        this.user = user;
        this.imageUrl = user.imageUrl;
        console.log("user-info user =====>", this.user);
      }
    );
    this.memeImageSubscription = this.userService.memeChanged.subscribe(
      (url: string) => {
        this.imageUrl = url;
      }
    );
    this.userService.autoSetUser()
    if (this.user) {
      this.imageUrl = this.user.imageUrl;
    }
    if (this.user) {
      this.formatValues();
    }
  }

  handleRefreshImage(): void {
    this.userService.handleRefreshImage();
  }

  formatValues(): void {
    if (this.user) {
      this.totalWorkedHours = this.user.totalWorkHours.toString();
      this.totalOffDays = (
        +this.user.shifts[0].restDays * (this.user.shifts.length - 1) * 24 +
        this.shiftService.sumHolidays()
      ).toString();
      this.totalRest = (
        this.user.totalFreeHours +
        this.shiftService.sumHolidays() * 24 -
        (24 - this.user.shifts[0].workingHours) *
          this.shiftService.sumHolidays()
      ).toString();
    }
  }

  onReset(): void {
    // this.userForm.reset(); add routing
    this.userService.clearUser();
    this.userService.deleteUser();
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
    this.memeImageSubscription.unsubscribe();
  }
}
