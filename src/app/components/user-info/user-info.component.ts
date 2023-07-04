import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { ShiftService } from 'src/app/services/shift.service';
import { StorageService } from 'src/app/services/storage.service';
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
    private storageService: StorageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userSubscription = this.userService.userChanged.subscribe(
      (user: User) => {
        this.user = user;
        this.imageUrl = user.imageUrl;
      }
    );
    if (!this.user) {
      this.userService.autoSetUser();
    }
    if (!this.user) {
      this.router.navigate(['/']);
    }
    this.memeImageSubscription = this.userService.memeChanged.subscribe(
      (url: string) => {
        this.imageUrl = url;
      }
    );

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
        this.user.totallfreeHours +
        this.shiftService.sumHolidays() * 24 -
        (24 - this.user.shifts[0].workingHours) *
          this.shiftService.sumHolidays()
      ).toString();
    }
  }

  onReset(): void {
    this.storageService.clearStorage();
    this.userService.clearUser();
    this.userService.deleteUser();
    this.router.navigate(['/']);
  }

  ngOnDestroy(): void {
    this.userSubscription.unsubscribe();
    this.memeImageSubscription.unsubscribe();
  }
}
