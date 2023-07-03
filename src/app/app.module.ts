import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CalendarComponent } from './components/calendar/calendar.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { NgApexchartsModule } from 'ng-apexcharts';

import { CommonModule } from '@angular/common';

import { UserComponent } from './components/user/user.component';

import { PieChartComponent } from './components/pie-chart/pie-chart.component';
import { UserInfoComponent } from './components/user-info/user-info.component';
import { RouterModule, Routes } from '@angular/router';

const appRoutes: Routes = [
    { path: '', component: UserComponent},
    { path: 'results', component: UserInfoComponent}
]

@NgModule({
  declarations: [
    AppComponent,
    CalendarComponent,
    UserComponent,
    PieChartComponent,
    UserInfoComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatListModule,
    MatTabsModule,
    MatSelectModule,
    CommonModule,
    ReactiveFormsModule,
    NgApexchartsModule,
    RouterModule.forRoot(appRoutes),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
