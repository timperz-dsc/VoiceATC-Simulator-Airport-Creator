export interface FlightRoute {
  id: string;
  airlines: string;
  popularity: number;
  route: string;
  acft: string;
  wake: 'L' | 'M' | 'H' | 'J';
  flBottom: number;
  flTop: number;
  status: 'Validated' | 'Draft';
  createdAt: Date;
}

export type SortField = keyof FlightRoute;
export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  field: SortField;
  direction: SortDirection;
} 