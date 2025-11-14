import { useState, useCallback } from 'react';
import { Spreadsheet } from '@/components/spreadsheet/Spreadsheet';
import { ToolPanel } from '@/components/spreadsheet/ToolPanel';
import { APISidebar } from '@/components/spreadsheet/APISidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { CellRange, RangeMapping, ArrayOrientation } from '@/types';

function App() {
  const [toolPanelPosition, setToolPanelPosition] = useState({ x: 0, y: 0 });
  const [showToolPanel, setShowToolPanel] = useState(false);
  const [currentMapping, setCurrentMapping] = useState<RangeMapping | null>(null);
  const [mappings, setMappings] = useState<RangeMapping[]>([]);
  const [isInput, setIsInput] = useState(true);
  const [mappingName, setMappingName] = useState('');

  const handleRangeSelect = useCallback((range: CellRange) => {

    // Position the tool panel near the selection
    setToolPanelPosition({
      x: 400,
      y: 150,
    });

    // Check if this range already has a mapping
    const existingMapping = mappings.find(
      (m) =>
        m.range.startRow === range.startRow &&
        m.range.startColumn === range.startColumn &&
        m.range.endRow === range.endRow &&
        m.range.endColumn === range.endColumn
    );

    if (existingMapping) {
      setCurrentMapping(existingMapping);
      setMappingName(existingMapping.name);
      setIsInput(existingMapping.isInput);
    } else {
      // Create a new mapping
      const newMapping: RangeMapping = {
        id: `mapping-${Date.now()}`,
        range,
        name: '',
        orientation: 'row-based',
        attributes: {},
        isInput: true,
      };
      setCurrentMapping(newMapping);
      setMappingName('');
      setIsInput(true);
    }

    setShowToolPanel(true);
  }, [mappings]);

  const handleOrientationChange = useCallback((orientation: ArrayOrientation) => {
    if (currentMapping) {
      const updated = { ...currentMapping, orientation };
      setCurrentMapping(updated);
      updateMapping(updated);
    }
  }, [currentMapping]);

  const handleAttributeName = useCallback(
    (index: number, name: string) => {
      if (currentMapping) {
        const updated = {
          ...currentMapping,
          attributes: { ...currentMapping.attributes, [index]: name },
        };
        setCurrentMapping(updated);
        updateMapping(updated);
      }
    },
    [currentMapping]
  );

  const handleSaveMapping = useCallback(() => {
    if (currentMapping && mappingName) {
      const updated = { ...currentMapping, name: mappingName, isInput };
      setCurrentMapping(updated);
      updateMapping(updated);
    }
  }, [currentMapping, mappingName, isInput]);

  const updateMapping = useCallback((updated: RangeMapping) => {
    setMappings((prev) => {
      const index = prev.findIndex((m) => m.id === updated.id);
      if (index >= 0) {
        const newMappings = [...prev];
        newMappings[index] = updated;
        return newMappings;
      } else {
        return [...prev, updated];
      }
    });
  }, []);

  const handleAddRow = useCallback(
    (_position: 'before' | 'after') => {
      if (!currentMapping) return;

      const updated = {
        ...currentMapping,
        range: {
          ...currentMapping.range,
          endRow: currentMapping.range.endRow + 1,
        },
      };
      setCurrentMapping(updated);
      updateMapping(updated);
    },
    [currentMapping, updateMapping]
  );

  const handleAddColumn = useCallback(
    (_position: 'before' | 'after') => {
      if (!currentMapping) return;

      const updated = {
        ...currentMapping,
        range: {
          ...currentMapping.range,
          endColumn: currentMapping.range.endColumn + 1,
        },
      };
      setCurrentMapping(updated);
      updateMapping(updated);
    },
    [currentMapping, updateMapping]
  );

  const handleRemoveRow = useCallback(() => {
    if (!currentMapping) return;

    const updated = {
      ...currentMapping,
      range: {
        ...currentMapping.range,
        endRow: Math.max(
          currentMapping.range.startRow,
          currentMapping.range.endRow - 1
        ),
      },
    };
    setCurrentMapping(updated);
    updateMapping(updated);
  }, [currentMapping, updateMapping]);

  const handleRemoveColumn = useCallback(() => {
    if (!currentMapping) return;

    const updated = {
      ...currentMapping,
      range: {
        ...currentMapping.range,
        endColumn: Math.max(
          currentMapping.range.startColumn,
          currentMapping.range.endColumn - 1
        ),
      },
    };
    setCurrentMapping(updated);
    updateMapping(updated);
  }, [currentMapping, updateMapping]);

  const handleDragStart = useCallback(() => {
    console.log('Drag started - would enable drag mode');
    // In a real implementation, this would enable a drag mode
  }, []);

  const handleCloseToolPanel = useCallback(() => {
    setShowToolPanel(false);
    setCurrentMapping(null);
  }, []);

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <header className="border-b bg-background px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">XPricing PoC</h1>
            <p className="text-sm text-muted-foreground">
              Excel REST API Mapping Interface
            </p>
          </div>
          <div className="flex items-center gap-4">
            {currentMapping && (
              <Card className="border-primary">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="mapping-name" className="text-xs">
                      Mapping Name
                    </Label>
                    <Input
                      id="mapping-name"
                      value={mappingName}
                      onChange={(e) => setMappingName(e.target.value)}
                      placeholder="e.g., products"
                      className="w-48"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Type</Label>
                    <div className="flex gap-2">
                      <Button
                        variant={isInput ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setIsInput(true)}
                      >
                        Input
                      </Button>
                      <Button
                        variant={!isInput ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setIsInput(false)}
                      >
                        Output
                      </Button>
                    </div>
                  </div>
                  <Button
                    onClick={handleSaveMapping}
                    disabled={!mappingName}
                    className="mt-6"
                  >
                    Save Mapping
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Spreadsheet Area */}
        <div className="flex-1 relative">
          <Spreadsheet onRangeSelect={handleRangeSelect} />

          {/* Tool Panel */}
          {showToolPanel && currentMapping && (
            <ToolPanel
              range={currentMapping.range}
              position={toolPanelPosition}
              orientation={currentMapping.orientation}
              onOrientationChange={handleOrientationChange}
              onAddRow={handleAddRow}
              onAddColumn={handleAddColumn}
              onRemoveRow={handleRemoveRow}
              onRemoveColumn={handleRemoveColumn}
              onDragStart={handleDragStart}
              onAttributeName={handleAttributeName}
              attributes={currentMapping.attributes}
              onClose={handleCloseToolPanel}
            />
          )}
        </div>

        {/* API Sidebar */}
        <APISidebar mappings={mappings.filter((m) => m.name)} />
      </div>
    </div>
  );
}

export default App;
