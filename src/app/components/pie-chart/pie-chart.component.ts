import { Component, ViewChild } from '@angular/core';
import { ChartComponent } from 'ng-apexcharts';
import { UserService } from '../../services/user.service';
import { ChartOptions } from 'src/app/models/chart.model';

@Component({
  selector: 'app-pie-chart',
  templateUrl: './pie-chart.component.html',
  styleUrls: ['./pie-chart.component.scss'],
})
export class PieChartComponent {
  chartOptions: Partial<ChartOptions>;
  @ViewChild('chart') chart: ChartComponent;

  constructor(private userService: UserService) {
    this.chartOptions = {
      series: [
        this.userService.getUser().totalWorkHours,
        this.userService.getUser().totallfreeHours,
      ],
      chart: {
        width: 570,
        type: 'pie',
      },
      labels: ['Total work hours', 'Total free hours'],
    };
  }
}
