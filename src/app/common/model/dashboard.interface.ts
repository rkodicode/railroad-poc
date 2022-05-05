export interface DashboardData {
  title: string;
  division: string;
  project_owner: string;
  budget: number;
  status: string;
  created: string | Date;
  modified: string | Date;
}

export interface statData {
  totalAccounting: number;
  totalAdministration: number;
  totalSales: number;
  totalMarketing: number;
  totalProduction: number;
  workingStatusCount: number;
  deliveredStatusCount: number;
  archivedStatusCount: number;
  newStatusCount: number;
}
