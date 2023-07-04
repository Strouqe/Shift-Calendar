import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { StorageService } from 'src/app/services/storage.service';
import { UserService } from 'src/app/services/user.service';
import { Gender } from '../../models/user.model';
import { GeoService } from '../../services/geo.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit, OnDestroy {
  private memeImageSubscription: Subscription;
  userForm: FormGroup;
  startDate: Date;
  genders: Gender[] = [
    {value: 'male', viewValue: 'Male'},
    {value: 'female', viewValue: 'Female'},
  ]
  private memeUrl: string;

  constructor(
    private userService: UserService,
    private geoService: GeoService,
    private storageService: StorageService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    if(this.storageService.getUserInput()){
      this.router.navigate(['/results']);
    }
    this.geoService.getCurrentLocation();
    this.startDate = new Date();
    this.initForm();
    this.memeImageSubscription = this.userService.memeChanged.subscribe(
      (url: string) => {
        this.memeUrl = url;
      }
    );
  }

  ngOnDestroy(): void {
    this.memeImageSubscription.unsubscribe();
  }

  handleRefreshImage(): void {
    this.userService.handleRefreshImage();
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
      this.userForm.value.imageUrl ? this.userForm.value.imageUrl : this.memeUrl
    );
    this.router.navigate(['/results']);
  }

  onReset(): void {
    this.userForm.reset();
    this.userService.clearUser();
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


}
