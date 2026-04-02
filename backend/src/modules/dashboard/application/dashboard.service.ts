import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { BaseResponseDto } from 'src/common/dto/base-response.dto';
import { DashboardRepoAbstract } from '../domain/repositories/dashboard.repositories';
import { DashboardDomainService } from '../domain/services/dashboard-domain.service';
import { DashboardStatsEntity, DashboardData } from '../domain/entities/dashboard-stats.entity';
import { DashboardAbstract } from './dashboard.abstract';

@Injectable()
export class DashboardService implements DashboardAbstract {
  constructor(
    private readonly dashboardRepo: DashboardRepoAbstract,
    private readonly dashboardDomainService: DashboardDomainService
  ) {}

  async getDashboardStats(): Promise<BaseResponseDto<DashboardData>> {
    try {
      // 1. Get total counts
      const [totalUsers, totalPosts, totalProducts, totalBanners] =
        await Promise.all([
          this.dashboardRepo.countUsers(),
          this.dashboardRepo.countPosts(),
          this.dashboardRepo.countProducts(),
          this.dashboardRepo.countBanners(),
        ]);

      // 2. Get today's data
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const [todayNewUsers, todayNewPosts, todayNewProducts] =
        await Promise.all([
          this.dashboardRepo.countUsers({ createdAt: { $gte: today } }),
          this.dashboardRepo.countPosts({ createdAt: { $gte: today } }),
          this.dashboardRepo.countProducts({ createdAt: { $gte: today } }),
        ]);

      // 3. Get active users (last 24 hours)
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const activeUsers = await this.dashboardRepo.countUsers({
        lastLoginAt: { $gte: yesterday },
      });

      // 4. Calculate page views
      const todayPageViews = this.dashboardDomainService.calculatePageViews(todayNewUsers);

      // 5. Get yearly aggregation data
      const currentYear = new Date().getFullYear();
      const startOfYear = new Date(currentYear, 0, 1);
      const endOfYear = new Date(currentYear, 11, 31, 23, 59, 59);

      const [postsByMonthAgg, userGrowthByMonthAgg] = await Promise.all([
        this.dashboardRepo.aggregatePostsByMonth(startOfYear, endOfYear),
        this.dashboardRepo.aggregateUsersByMonth(startOfYear, endOfYear),
      ]);

      // 6. Process chart data
      const monthlyPosts = this.dashboardDomainService.calculateMonthlyData(postsByMonthAgg);
      const monthlyUserGrowth = this.dashboardDomainService.calculateCumulativeGrowth(userGrowthByMonthAgg);

      // 7. Get recent data
      const [recentPosts, topCategories] = await Promise.all([
        this.dashboardRepo.getRecentPosts(5),
        this.dashboardRepo.aggregateTopCategories(5),
      ]);

      // 8. Get registration trend for last 7 days
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        d.setHours(0, 0, 0, 0);
        return d;
      });

      const dailyRegistrations =
        await this.dashboardRepo.aggregateDailyRegistrations(last7Days[0]);

      const registrationTrend = this.dashboardDomainService.calculateRegistrationTrend(
        dailyRegistrations,
        last7Days
      );

      // 9. Get product status counts
      const [newProductCount, secondHandProductCount] = await Promise.all([
        this.dashboardRepo.countProducts({ status: 'New' }),
        this.dashboardRepo.countProducts({ status: 'SecondHand' }),
      ]);

      // 10. Generate analytics data
      const deviceDistribution = this.dashboardDomainService.generateDeviceDistribution();
      const browserDistribution = this.dashboardDomainService.generateBrowserDistribution();

      // 11. Create dashboard entity
      const dashboardStats = DashboardStatsEntity.create({
        summary: {
          totalUsers,
          totalPosts,
          totalProducts,
          totalBanners,
          activeUsers,
          todayNewUsers,
          todayNewPosts,
          todayNewProducts,
          todayPageViews,
          newProductCount,
          secondHandProductCount,
        },
        charts: {
          postsByMonth: monthlyPosts,
          userGrowth: monthlyUserGrowth,
          registrationTrend,
        },
        analytics: {
          devices: deviceDistribution,
          browsers: browserDistribution,
        },
        recentPosts,
        topCategories,
      });

      return {
        success: true,
        message: 'Lấy dữ liệu thống kê Dashboard thành công',
        data: {
          summary: dashboardStats['summary'],
          charts: dashboardStats['charts'],
          analytics: dashboardStats['analytics'],
          recentPosts: dashboardStats['recentPosts'],
          topCategories: dashboardStats['topCategories'],
        },
      };
    } catch (error: any) {
      console.error('Lỗi tại DashboardService:', error);
      throw new InternalServerErrorException(
        error.message || 'Lỗi hệ thống khi lấy dữ liệu thống kê',
      );
    }
  }
}
