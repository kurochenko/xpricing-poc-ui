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

// Import locale data
// @ts-ignore - locale files don't have type declarations
import DesignEnUS from '@univerjs/design/lib/locale/en-US.js';
// @ts-ignore
import SheetsEnUS from '@univerjs/sheets/lib/locale/en-US.js';
// @ts-ignore
import SheetsUIEnUS from '@univerjs/sheets-ui/lib/locale/en-US.js';

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
    if (!containerRef.current) {
      console.log('[Univer] Container ref not available');
      return;
    }

    console.log('[Univer] Initializing UniverJS...');

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
    const timeoutId = setTimeout(() => {
      if (!containerRef.current) {
        console.warn('[Univer] Container ref lost during timeout');
        return;
      }

      try {
        console.log('[Univer] Creating Univer instance...');

        // Initialize Univer with locale data
        const univer = new Univer({
          theme: defaultTheme,
          locale: LocaleType.EN_US,
          locales: {
            [LocaleType.EN_US]: {
              ...DesignEnUS,
              ...SheetsEnUS,
              ...SheetsUIEnUS,
            },
          },
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
        console.log('[Univer] Loading workbook:', dataToLoad.name, 'with', Object.keys(dataToLoad.sheets).length, 'sheets');
        univer.createUnit(UniverInstanceType.UNIVER_SHEET, dataToLoad);

        univerRef.current = univer;
        console.log('[Univer] UniverJS initialized successfully');
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
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{
        backgroundColor: 'hsl(var(--muted) / 0.5)',
        padding: '0.5rem 1rem',
        fontSize: '0.75rem',
        color: 'hsl(var(--muted-foreground))',
        borderBottom: '1px solid hsl(var(--border))',
        flexShrink: 0
      }}>
        Tip: Select cells in the spreadsheet, then press <kbd style={{ padding: '0.25rem 0.5rem', backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))', borderRadius: '0.25rem' }}>Ctrl+M</kbd> to create a mapping
      </div>
      <div
        ref={containerRef}
        style={{
          flex: 1,
          minHeight: 0
        }}
      />
    </div>
  );
}
