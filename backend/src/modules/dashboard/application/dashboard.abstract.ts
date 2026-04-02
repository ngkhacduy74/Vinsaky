import { DashboardData } from '../domain/entities/dashboard-stats.entity';

export abstract class DashboardAbstract {
  abstract getDashboardStats(): Promise<any>;
}
