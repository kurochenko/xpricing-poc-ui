import * as XLSX from 'xlsx';
import { LocaleType, type IWorkbookData } from '@univerjs/core';

export function parseExcelFile(file: File): Promise<IWorkbookData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary', cellFormula: true, cellStyles: true });

        // Convert to UniverJS format
        const univerWorkbook: IWorkbookData = {
          id: 'workbook-' + Date.now(),
          name: file.name.replace(/\.[^/.]+$/, ''),
          appVersion: '0.1.0',
          locale: LocaleType.EN_US,
          styles: {},
          sheetOrder: [],
          sheets: {},
        };

        workbook.SheetNames.forEach((sheetName, index) => {
          const worksheet = workbook.Sheets[sheetName];
          const sheetId = `sheet-${index}`;

          univerWorkbook.sheetOrder.push(sheetId);

          // Get the range of the worksheet
          const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1');

          // Convert cells to UniverJS format
          const cellData: any = {};

          for (let row = range.s.r; row <= range.e.r; row++) {
            cellData[row] = {};

            for (let col = range.s.c; col <= range.e.c; col++) {
              const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
              const cell = worksheet[cellAddress];

              if (cell) {
                const univerCell: any = {};

                // Handle cell value
                if (cell.f) {
                  // Formula
                  univerCell.f = '=' + cell.f;
                  univerCell.v = cell.v;
                } else if (cell.v !== undefined) {
                  univerCell.v = cell.v;
                }

                // Handle cell type
                if (cell.t === 'n') {
                  // Number
                  univerCell.v = Number(cell.v);
                } else if (cell.t === 's') {
                  // String
                  univerCell.v = String(cell.v);
                } else if (cell.t === 'b') {
                  // Boolean
                  univerCell.v = Boolean(cell.v);
                }

                cellData[row][col] = univerCell;
              }
            }
          }

          univerWorkbook.sheets[sheetId] = {
            id: sheetId,
            name: sheetName,
            cellData,
            rowCount: Math.max(range.e.r + 1, 100),
            columnCount: Math.max(range.e.c + 1, 20),
          };
        });

        resolve(univerWorkbook);
      } catch (error) {
        reject(error);
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsBinaryString(file);
  });
}
