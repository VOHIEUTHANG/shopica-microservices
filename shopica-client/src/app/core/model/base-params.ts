import { Filter } from "./filter";

export class BaseParams {
  pageSize: number;
  pageIndex: number;
  filters: Filter[];
  sortField: string;
  sortOrder: string;

  constructor(pageIndex: number, pageSize: number) {
    this.pageIndex = pageIndex;
    this.pageSize = pageSize;
    this.filters = [];
    this.sortField = null;
    this.sortOrder = null;
  }
}
