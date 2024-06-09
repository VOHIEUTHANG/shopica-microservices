import { CategoryReport } from './category';
import { State } from './state';

export interface Report {
  revenue: string;
  order: number;
  reviews: number;
  customer: number;
  category: CategoryReport[];
  state: State;
  revenues: number[];
  sales: number[];
}
