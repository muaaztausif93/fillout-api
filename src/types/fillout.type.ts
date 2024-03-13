export enum FilterCondition {
  Equals = "equals",
  DoesNotEqual = "does_not_equal",
  GreaterThan = "greater_than",
  LessThan = "less_than",
}

export type FilterClauseType = {
  id: string;
  condition: FilterCondition;
  value: number | string;
};

export type ResponseFiltersType = FilterClauseType[];

export interface SubmissionsQueryParams {
  limit?: number;
  afterDate?: string;
  beforeDate?: string;
  offset?: number;
  status?: string;
  includeEditLink?: boolean;
  sort?: "asc" | "desc";
  filters?: ResponseFiltersType;
}
