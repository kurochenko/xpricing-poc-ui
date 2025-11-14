export interface CellRange {
  startRow: number;
  startColumn: number;
  endRow: number;
  endColumn: number;
}

export type ArrayOrientation = 'row-based' | 'column-based';

export interface RangeMapping {
  id: string;
  range: CellRange;
  name: string;
  orientation: ArrayOrientation;
  attributes: Record<number, string>; // row/column index to attribute name
  isInput: boolean; // true for request, false for response
}

export interface Position {
  x: number;
  y: number;
}

export interface APIStructure {
  request: Record<string, any>;
  response: Record<string, any>;
}
