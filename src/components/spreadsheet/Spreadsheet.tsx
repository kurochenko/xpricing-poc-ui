import { useEffect, useRef } from 'react';
import { LocaleType, type IWorkbookData } from '@univerjs/core';
import { defaultTheme } from '@univerjs/design';
import { UniverSheetsCorePreset } from '@univerjs/presets';
import { UniverSheetsFilterPreset } from '@univerjs/presets/preset-sheets-filter';
import type { CellRange } from '@/types';

import '@univerjs/presets/lib/styles/preset-sheets-core.css';

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
  const univerRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current) {
      console.log('[Univer] Container ref not available');
      return;
    }

    console.log('[Univer] Initializing with Presets API...');

    // Clean up existing instance
    if (univerRef.current) {
      console.log('[Univer] Disposing existing instance');
      try {
        univerRef.current.dispose();
      } catch (e) {
        console.error('[Univer] Error disposing:', e);
      }
      univerRef.current = null;
    }

    // Wait a tick to ensure cleanup is complete
    const timeoutId = setTimeout(async () => {
      if (!containerRef.current) {
        console.warn('[Univer] Container ref lost');
        return;
      }

      try {
        console.log('[Univer] Creating preset instance...');

        // Use the modern Presets API
        const { univerAPI } = UniverSheetsCorePreset({
          container: containerRef.current,
          workbook: workbookData || DEFAULT_WORKBOOK,
        });

        univerRef.current = univerAPI;
        console.log('[Univer] Preset initialized successfully');
      } catch (error) {
        console.error('[Univer] Initialization error:', error);
        if (error instanceof Error) {
          console.error('[Univer] Error stack:', error.stack);
        }
      }
    }, 100);

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
      clearTimeout(timeoutId);
      document.removeEventListener('keydown', handleKeyPress);
      if (univerRef.current) {
        try {
          univerRef.current.dispose();
        } catch (e) {
          console.error('Error during cleanup:', e);
        }
      }
    };
  }, [onRangeSelect, workbookData]);

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
      <div ref={containerRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}
