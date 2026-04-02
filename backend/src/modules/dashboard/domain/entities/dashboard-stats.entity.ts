export interface DashboardSummary {
  totalUsers: number;
  totalPosts: number;
  totalProducts: number;
  totalBanners: number;
  activeUsers: number;
  todayNewUsers: number;
  todayNewPosts: number;
  todayNewProducts: number;
  todayPageViews: number;
  newProductCount: number;
  secondHandProductCount: number;
}

export interface DashboardCharts {
  postsByMonth: number[];
  userGrowth: number[];
  registrationTrend: number[];
}

export interface DashboardAnalytics {
  devices: Array<{ device: string; percentage: number }>;
  browsers: Array<{ browser: string; percentage: number }>;
}

export interface DashboardData {
  summary: DashboardSummary;
  charts: DashboardCharts;
  analytics: DashboardAnalytics;
  recentPosts: any[];
  topCategories: any[];
}

export class DashboardStatsEntity {
  constructor(
    public readonly summary: DashboardSummary,
    public readonly charts: DashboardCharts,
    public readonly analytics: DashboardAnalytics,
    public readonly recentPosts: any[],
    public readonly topCategories: any[]
  ) {}

  static create(data: {
    summary: DashboardSummary;
    charts: DashboardCharts;
    analytics: DashboardAnalytics;
    recentPosts: any[];
    topCategories: any[];
  }): DashboardStatsEntity {
    return new DashboardStatsEntity(
      data.summary,
      data.charts,
      data.analytics,
      data.recentPosts,
      data.topCategories
    );
  }
}
