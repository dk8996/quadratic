import { CELL_HEIGHT, CELL_WIDTH } from '../../constants/gridConstants';
import { Heading } from './db';

export class GridOffsets {
  private columns: Record<string, Heading> = {};
  private rows: Record<string, Heading> = {};

  populate(columns: Heading[], rows: Heading[]): void {
    this.columns = {};
    columns.forEach(entry => this.columns[entry.id] = entry);
    this.rows = {};
    rows.forEach(entry => this.rows[entry.id] = entry);
  }

  getColumnWidth(column: number): number {
    return this.columns[column]?.size ?? CELL_WIDTH;
  }

  getRowHeight(row: number): number {
    return this.rows[row]?.size ?? CELL_HEIGHT;
  }

  getColumnPlacement(column: number): { x: number, width: number } {
    let position = 0;
    if (column >= 0) {
      for (let x = 0; x < column; x++) {
        position += this.columns[x]?.size ?? CELL_WIDTH;
      }
      return { x: position, width: this.getColumnWidth(column) };
    } else {
      for (let x = column; x < 0; x++) {
        position -= this.columns[x]?.size ?? CELL_WIDTH;
      }
      return { x: position, width: this.getColumnWidth(column) };
    }
  }

  getRowPlacement(row: number): { y: number, height: number } {
    let position = 0;
    if (row >= 0) {
      for (let y = 0; y < row; y++) {
        position += this.rows[y]?.size ?? CELL_HEIGHT;
      }
      return { y: position, height: this.getRowHeight(row) };
    } else {
      for (let y = row; y < 0; y++) {
        position -= this.rows[y]?.size ?? CELL_HEIGHT;
      }
      return { y: position, height: this.getRowHeight(row) };
    }
  }

  getColumnIndex(x: number): { index: number, position: number } {
    if (x >= 0) {
      let index = 0;
      let position = 0;
      let nextWidth = this.getColumnWidth(0)
      while (position + nextWidth < x) {
        position += nextWidth;
        index++;
        nextWidth = this.getColumnWidth(index);
      }
      return { index, position };
    } else {
      let index = 0;
      let position = 0;
      while (position > x) {
        index--;
        position -= this.getColumnWidth(index);
      }
      return { index, position };
    }
  }

  getRowIndex(y: number): { index: number, position: number } {
    if (y >= 0) {
      let index = 0;
      let position = 0;
      let nextHeight = this.getRowHeight(0);
      while (position + nextHeight < y) {
        position += nextHeight;
        index++;
        nextHeight = this.getRowHeight(index);
      }
      return { index, position };
    } else {
      let index = 0;
      let position = 0;
      while (position > y) {
        index--;
        position -= this.getRowHeight(index);
      }
      return { index, position };
    }
  }

  getRowColumnFromWorld(x: number, y: number ): { column: number, row: number } {
    return { column: this.getColumnIndex(x).index, row: this.getRowIndex(y).index };
  }

  getCell(column: number, row: number): { x: number, y: number, width: number, height: number } {
    const columnPlacement = this.getColumnPlacement(column);
    const rowPlacement = this.getRowPlacement(row);
    return {
      x: columnPlacement.x,
      y: rowPlacement.y,
      width: columnPlacement.width,
      height: rowPlacement.height,
    }
  }
}

export const gridOffsets = new GridOffsets();