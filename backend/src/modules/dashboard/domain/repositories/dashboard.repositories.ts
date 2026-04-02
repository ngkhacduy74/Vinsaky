export abstract class DashboardRepoAbstract {
  abstract countUsers(filter?: any): Promise<number>;
  abstract countPosts(filter?: any): Promise<number>;
  abstract countProducts(filter?: any): Promise<number>;
  abstract countBanners(): Promise<number>;
  abstract aggregatePostsByMonth(startDate: Date, endDate: Date): Promise<any[]>;
  abstract aggregateUsersByMonth(startDate: Date, endDate: Date): Promise<any[]>;
  abstract getRecentPosts(limit: number): Promise<any[]>;
  abstract aggregateTopCategories(limit: number): Promise<any[]>;
  abstract aggregateDailyRegistrations(startDate: Date): Promise<any[]>;
}
