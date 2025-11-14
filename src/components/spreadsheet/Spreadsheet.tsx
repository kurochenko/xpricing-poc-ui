import { useEffect, useRef } from 'react';
import { Univer, UniverInstanceType, LocaleType, type IWorkbookData } from '@univerjs/core';
import { defaultTheme } from '@univerjs/design';
import { UniverDocsPlugin } from '@univerjs/docs';
import { UniverDocsUIPlugin } from '@univerjs/docs-ui';
import { UniverFormulaEnginePlugin } from '@univerjs/engine-formula';
import { UniverRenderEnginePlugin } from '@univerjs/engine-render';
import { UniverSheetsPlugin } from '@univerjs/sheets';
import { UniverSheetsFormulaPlugin } from '@univerjs/sheets-formula';
import { UniverSheetsUIPlugin } from '@univerjs/sheets-ui';
import { UniverUIPlugin } from '@univerjs/ui';
import type { CellRange } from '@/types';

const DEFAULT_WORKBOOK: IWorkbookData = {
  id: 'xpricing-workbook',
  name: 'Sample Workbook',
  appVersion: '0.1.0',
  locale: LocaleType.EN_US,
  styles: {},
  sheetOrder: ['sheet-1'],
  sheets: {
    'sheet-1': {
      id: 'sheet-1',
      name: 'Sample Data',
      cellData: {
        0: {
          0: { v: 'Product' },
          1: { v: 'Quantity' },
          2: { v: 'Price' },
          3: { v: 'Total' },
        },
        1: {
          0: { v: 'Item A' },
          1: { v: 10 },
          2: { v: 25.5 },
          3: { v: 255, f: '=B2*C2' },
        },
        2: {
          0: { v: 'Item B' },
          1: { v: 5 },
          2: { v: 42.0 },
          3: { v: 210, f: '=B3*C3' },
        },
        3: {
          0: { v: 'Item C' },
          1: { v: 8 },
          2: { v: 15.75 },
          3: { v: 126, f: '=B4*C4' },
        },
      },
      rowCount: 100,
      columnCount: 20,
    },
  },
};

interface SpreadsheetProps {
  onRangeSelect?: (range: CellRange) => void;
  workbookData?: IWorkbookData | null;
}

export function Spreadsheet({ onRangeSelect, workbookData }: SpreadsheetProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const univerRef = useRef<Univer | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clean up existing instance
    if (univerRef.current) {
      univerRef.current.dispose();
      univerRef.current = null;
    }

    // Initialize Univer
    const univer = new Univer({
      theme: defaultTheme,
      locale: LocaleType.EN_US,
    });

    // Register plugins
    univer.registerPlugin(UniverRenderEnginePlugin);
    univer.registerPlugin(UniverUIPlugin, {
      container: containerRef.current,
      header: true,
      toolbar: true,
      footer: true,
    });
    univer.registerPlugin(UniverDocsPlugin, {
      hasScroll: false,
    });
    univer.registerPlugin(UniverDocsUIPlugin);
    univer.registerPlugin(UniverSheetsPlugin);
    univer.registerPlugin(UniverSheetsUIPlugin);
    univer.registerPlugin(UniverFormulaEnginePlugin);
    univer.registerPlugin(UniverSheetsFormulaPlugin);

    // Create workbook from data or use default
    const dataToLoad = workbookData || DEFAULT_WORKBOOK;
    univer.createUnit(UniverInstanceType.UNIVER_SHEET, dataToLoad);

    univerRef.current = univer;

    // For the PoC, we'll use a keyboard shortcut to trigger selection
    // Users can select a range and press Ctrl+M to map it
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'm') {
        e.preventDefault();
        // Trigger a sample selection for demonstration
        // In a real implementation, you'd get the actual selected range
        const sampleRange: CellRange = {
          startRow: 0,
          startColumn: 0,
          endRow: 3,
          endColumn: 3,
        };
        onRangeSelect?.(sampleRange);
      }
    };

    document.addEventListener('keydown', handleKeyPress);

    // Cleanup
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
      univer.dispose();
    };
  }, [onRangeSelect, workbookData]);

  return (
    <div className="w-full h-full flex flex-col">
      <div className="bg-muted/50 px-4 py-2 text-xs text-muted-foreground border-b">
        Tip: Select cells in the spreadsheet, then press <kbd className="px-2 py-1 bg-background border rounded">Ctrl+M</kbd> to create a mapping
      </div>
      <div
        ref={containerRef}
        className="flex-1 relative"
        style={{ minHeight: '600px' }}
      />
    </div>
  );
}
