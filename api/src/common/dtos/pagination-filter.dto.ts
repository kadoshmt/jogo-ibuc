export interface PaginationFilter {
  page: number;
  perPage: number;
  sort: string;
  q?: string;
  conditions?: Array<{
    column: string;
    value: string;
    condition:
      | 'equals'
      | 'contains'
      | 'in'
      | 'notIn'
      | 'startsWith'
      | 'endsWith'
      | 'lt'
      | 'lte'
      | 'gt'
      | 'gte';
  }>;
}
