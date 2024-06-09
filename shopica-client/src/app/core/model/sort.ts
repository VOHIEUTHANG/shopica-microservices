export interface Sort {
  key: string;
  value: TableSortOrder
}
export type TableSortOrder = 'ascend' | 'descend'
