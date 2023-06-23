import { Component, ViewChild } from "@angular/core";
import { ChartComponent } from "ng-apexcharts";

import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart
} from "ng-apexcharts";
import { UserService } from "../../services/user.service";

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
};


@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss']
})
export class PieChartComponent {
  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  constructor(private userService: UserService) {
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
