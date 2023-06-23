import { Component, ViewChild } from "@angular/core";
import { ChartComponent } from "ng-apexcharts";
import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart
} from "ng-apexcharts";

import { UserService } from "../../services/user.service";   // TODO alt+shift+o

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
};   // TODO export type should be in models folder, create file like chart-options.ts

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent {
  @ViewChild("chart") chart: ChartComponent;  // TODO viewchild + view children should be after all variables 
  public chartOptions: Partial<ChartOptions>; // TODO variables is public by default, you can write it without public

  constructor(private userService: UserService) { // TODO constructor (
 //   private userService: UserService,
//  ) {
//}
    this.chartOptions = {
      series: [this.userService.getUser().totalWorkHours, this.userService.getUser().totalFreeHours],
      chart: {
        width: 390,
        type: "pie",

      },
      labels: ["Total work hours", "Total free hours"],
      // responsive: [
      //   {
      //     breakpoint: 360,
      //     options: {
      //       chart: {
      //         width: 150
      //       },
      //       legend: {
      //         position: "bottom"
      //       }
      //     }
      //   }
      // ]
    };
  }
}
