import { Injectable } from '@nestjs/common';

@Injectable()
export class DashboardDomainService {
  calculateMonthlyData(aggregateData: any[], totalMonths: number = 12): number[] {
    const monthlyData = Array(totalMonths).fill(0);
    aggregateData.forEach((item) => {
      if (item._id >= 1 && item._id <= totalMonths) {
        monthlyData[item._id - 1] = item.count;
      }
    });
    return monthlyData;
  }

  calculateCumulativeGrowth(aggregateData: any[], totalMonths: number = 12): number[] {
    const monthlyGrowth = Array(totalMonths).fill(0);
    let cumulative = 0;
    
    for (let i = 0; i < totalMonths; i++) {
      const monthData = aggregateData.find((item) => item._id === i + 1);
      if (monthData) cumulative += monthData.count;
      monthlyGrowth[i] = cumulative;
    }
    
    return monthlyGrowth;
  }

  calculateRegistrationTrend(dailyRegistrations: any[], last7Days: Date[]): number[] {
    return last7Days.map((date) => {
      const dateStr = date.toISOString().split('T')[0];
      const dayData = dailyRegistrations.find((item) => item._id === dateStr);
      return dayData ? dayData.count : 0;
    });
  }

  generateDeviceDistribution(): Array<{ device: string; percentage: number }> {
    return [
      { device: 'Desktop', percentage: 45 },
      { device: 'Mobile', percentage: 40 },
      { device: 'Tablet', percentage: 15 },
    ];
  }

  generateBrowserDistribution(): Array<{ browser: string; percentage: number }> {
    return [
      { browser: 'Chrome', percentage: 65 },
      { browser: 'Safari', percentage: 20 },
      { browser: 'Firefox', percentage: 8 },
      { browser: 'Edge', percentage: 5 },
      { browser: 'Others', percentage: 2 },
    ];
  }

  calculatePageViews(newUsers: number): number {
    // Simple estimation: 3 page views per new user
    return newUsers * 3;
  }
}
