import { Sheet } from '../../gridDB/Sheet';
import { Statement } from '../statement';
import { Cell } from '../../gridDB/gridTypes';
import { PixiApp } from '../../gridGL/pixiApp/PixiApp';
import { localFiles } from '../../gridDB/localFiles';

const CopyCell = (cell: Cell | undefined): Cell | undefined => {
  if (cell === undefined) return undefined;
  return { ...cell };
};

export const SetCellRunner = (sheet: Sheet, statement: Statement, app?: PixiApp): Statement => {
  if (statement.type !== 'SET_CELL') throw new Error('Incorrect statement type.');
  // Applies the SET_CELL statement to the sheet and returns the reverse statement
  const { position, value: new_value } = statement.data;
  const old_value = CopyCell(sheet.grid.getCell(position[0], position[1]));
  if (new_value === undefined) {
    // if we are deleting a cell, we need to delete it from the grid
    // and return a statement that applies the old value.
    sheet.grid.deleteCells([{ x: position[0], y: position[1] }]);
    if (app) {
      app.quadrants.quadrantChanged({ cells: [{ x: position[0], y: position[1] }] });
      app.cells.dirty = true;
      localFiles.saveLastLocal(sheet.export_file());
    }
    return {
      type: 'SET_CELL',
      data: {
        position,
        value: old_value,
      },
    } as Statement;
  } else {
    // if we are setting a cell, we need to update the grid
    // and return a statement that applies the old value.
    sheet.grid.updateCells([new_value]);
    if (app) {
      app.quadrants.quadrantChanged({ cells: [{ x: position[0], y: position[1] }] });
      app.cells.dirty = true;
      localFiles.saveLastLocal(sheet.export_file());
    }
    return {
      type: 'SET_CELL',
      data: {
        position,
        value: old_value,
      },
    } as Statement;
  }
};
