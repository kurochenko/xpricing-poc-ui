import { useState } from 'react';
import {
  ArrowDownToLine,
  ArrowRightToLine,
  GripVertical,
  Plus,
  Minus,
  Edit3,
  Save,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { ArrayOrientation, CellRange } from '@/types';
import { cn } from '@/lib/utils';

interface ToolPanelProps {
  range: CellRange;
  position: { x: number; y: number };
  orientation: ArrayOrientation;
  onOrientationChange: (orientation: ArrayOrientation) => void;
  onAddRow: (position: 'before' | 'after') => void;
  onAddColumn: (position: 'before' | 'after') => void;
  onRemoveRow: () => void;
  onRemoveColumn: () => void;
  onDragStart: () => void;
  onAttributeName: (index: number, name: string) => void;
  attributes: Record<number, string>;
  onClose: () => void;
}

export function ToolPanel({
  range,
  position,
  orientation,
  onOrientationChange,
  onAddRow,
  onAddColumn,
  onRemoveRow,
  onRemoveColumn,
  onDragStart,
  onAttributeName,
  attributes,
  onClose,
}: ToolPanelProps) {
  const [editingAttribute, setEditingAttribute] = useState<number | null>(null);
  const [attributeValue, setAttributeValue] = useState('');

  const isRowBased = orientation === 'row-based';
  const rowCount = range.endRow - range.startRow + 1;
  const colCount = range.endColumn - range.startColumn + 1;

  const handleSaveAttribute = () => {
    if (editingAttribute !== null) {
      onAttributeName(editingAttribute, attributeValue);
      setEditingAttribute(null);
      setAttributeValue('');
    }
  };

  const startEditAttribute = (index: number) => {
    setEditingAttribute(index);
    setAttributeValue(attributes[index] || '');
  };

  return (
    <Card
      className="absolute z-50 shadow-lg border-2 border-primary"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        minWidth: '320px',
      }}
    >
      <CardContent className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold">
            Range: {String.fromCharCode(65 + range.startColumn)}
            {range.startRow + 1}:{String.fromCharCode(65 + range.endColumn)}
            {range.endRow + 1}
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="text-xs text-muted-foreground">
          {rowCount} row{rowCount !== 1 ? 's' : ''} × {colCount} column
          {colCount !== 1 ? 's' : ''}
        </div>

        {/* Orientation */}
        <div className="space-y-2">
          <Label className="text-xs font-semibold">Array Orientation</Label>
          <div className="flex gap-2">
            <Button
              variant={isRowBased ? 'default' : 'outline'}
              size="sm"
              className="flex-1"
              onClick={() => onOrientationChange('row-based')}
            >
              <ArrowDownToLine className="h-4 w-4 mr-2" />
              Row-based
            </Button>
            <Button
              variant={!isRowBased ? 'default' : 'outline'}
              size="sm"
              className="flex-1"
              onClick={() => onOrientationChange('column-based')}
            >
              <ArrowRightToLine className="h-4 w-4 mr-2" />
              Column-based
            </Button>
          </div>
          <div className="text-xs text-muted-foreground">
            {isRowBased
              ? 'Each row is an object (outer array = rows)'
              : 'Each column is an object (outer array = columns)'}
          </div>
        </div>

        {/* Drag */}
        <div className="space-y-2">
          <Label className="text-xs font-semibold">Move Range</Label>
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            onMouseDown={onDragStart}
          >
            <GripVertical className="h-4 w-4 mr-2" />
            Drag to reposition
          </Button>
        </div>

        {/* Add/Remove Rows */}
        <div className="space-y-2">
          <Label className="text-xs font-semibold">Rows</Label>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => onAddRow('before')}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Before
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => onAddRow('after')}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add After
            </Button>
          </div>
          <Button
            variant="destructive"
            size="sm"
            className="w-full"
            onClick={onRemoveRow}
            disabled={rowCount <= 1}
          >
            <Minus className="h-4 w-4 mr-1" />
            Remove Row
          </Button>
        </div>

        {/* Add/Remove Columns */}
        <div className="space-y-2">
          <Label className="text-xs font-semibold">Columns</Label>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => onAddColumn('before')}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Before
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => onAddColumn('after')}
            >
              <Plus className="h-4 w-4 mr-1" />
              Add After
            </Button>
          </div>
          <Button
            variant="destructive"
            size="sm"
            className="w-full"
            onClick={onRemoveColumn}
            disabled={colCount <= 1}
          >
            <Minus className="h-4 w-4 mr-1" />
            Remove Column
          </Button>
        </div>

        {/* Attributes */}
        <div className="space-y-2">
          <Label className="text-xs font-semibold">
            Attribute Names ({isRowBased ? 'Columns' : 'Rows'})
          </Label>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {Array.from({
              length: isRowBased ? colCount : rowCount,
            }).map((_, idx) => {
              const actualIndex = isRowBased
                ? range.startColumn + idx
                : range.startRow + idx;
              const isEditing = editingAttribute === actualIndex;
              const currentName = attributes[actualIndex] || '';
              const label = isRowBased
                ? String.fromCharCode(65 + actualIndex)
                : `${actualIndex + 1}`;

              return (
                <div key={actualIndex} className="flex gap-2 items-center">
                  <div className="text-xs font-mono w-8">{label}:</div>
                  {isEditing ? (
                    <>
                      <Input
                        value={attributeValue}
                        onChange={(e) => setAttributeValue(e.target.value)}
                        className="flex-1 h-7 text-xs"
                        placeholder="attribute_name"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleSaveAttribute();
                          if (e.key === 'Escape') setEditingAttribute(null);
                        }}
                        autoFocus
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={handleSaveAttribute}
                      >
                        <Save className="h-3 w-3" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <div
                        className={cn(
                          'flex-1 text-xs px-2 py-1 rounded border',
                          currentName
                            ? 'bg-secondary'
                            : 'bg-muted text-muted-foreground'
                        )}
                      >
                        {currentName || 'unnamed'}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                        onClick={() => startEditAttribute(actualIndex)}
                      >
                        <Edit3 className="h-3 w-3" />
                      </Button>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
