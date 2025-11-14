import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import type { RangeMapping, APIStructure } from '@/types';
import { cn } from '@/lib/utils';

interface APISidebarProps {
  mappings: RangeMapping[];
  spreadsheetData?: any;
}

export function APISidebar({ mappings, spreadsheetData }: APISidebarProps) {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const apiStructure = useMemo<APIStructure>(() => {
    const request: Record<string, any> = {};
    const response: Record<string, any> = {};

    mappings.forEach((mapping) => {
      if (!mapping.name) return;

      // Build sample data structure based on orientation
      const sampleData =
        mapping.orientation === 'row-based'
          ? buildRowBasedData(mapping)
          : buildColumnBasedData(mapping);

      if (mapping.isInput) {
        request[mapping.name] = sampleData;
      } else {
        response[mapping.name] = sampleData;
      }
    });

    return { request, response };
  }, [mappings, spreadsheetData]);

  const copyToClipboard = async (text: string, section: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedSection(section);
      setTimeout(() => setCopiedSection(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const requestJson = JSON.stringify(apiStructure.request, null, 2);
  const responseJson = JSON.stringify(apiStructure.response, null, 2);

  return (
    <div className="w-96 border-l bg-muted/30 p-4 space-y-4 overflow-y-auto">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">API Preview</h2>
        <p className="text-sm text-muted-foreground">
          Real-time view of API request/response structure
        </p>
      </div>

      {/* Request */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold">
              Request Body
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => copyToClipboard(requestJson, 'request')}
            >
              {copiedSection === 'request' ? (
                <Check className="h-3 w-3 text-green-500" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="relative">
            <pre className="text-xs bg-background p-3 rounded-md border overflow-x-auto max-h-64 overflow-y-auto">
              <code className="text-xs">{requestJson}</code>
            </pre>
            {Object.keys(apiStructure.request).length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-xs text-muted-foreground">
                  No request mappings defined
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Response */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-semibold">
              Response Body
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => copyToClipboard(responseJson, 'response')}
            >
              {copiedSection === 'response' ? (
                <Check className="h-3 w-3 text-green-500" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="relative">
            <pre className="text-xs bg-background p-3 rounded-md border overflow-x-auto max-h-64 overflow-y-auto">
              <code className="text-xs">{responseJson}</code>
            </pre>
            {Object.keys(apiStructure.response).length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="text-xs text-muted-foreground">
                  No response mappings defined
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Mappings List */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">
            Active Mappings
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {mappings.length === 0 ? (
            <p className="text-xs text-muted-foreground">
              Select a range to create a mapping
            </p>
          ) : (
            <div className="space-y-2">
              {mappings.map((mapping) => (
                <div
                  key={mapping.id}
                  className={cn(
                    'p-2 rounded-md border text-xs',
                    mapping.isInput
                      ? 'bg-blue-50 border-blue-200 dark:bg-blue-950 dark:border-blue-800'
                      : 'bg-green-50 border-green-200 dark:bg-green-950 dark:border-green-800'
                  )}
                >
                  <div className="font-semibold">
                    {mapping.name || 'Unnamed'}
                  </div>
                  <div className="text-muted-foreground">
                    Range:{' '}
                    {String.fromCharCode(65 + mapping.range.startColumn)}
                    {mapping.range.startRow + 1}:
                    {String.fromCharCode(65 + mapping.range.endColumn)}
                    {mapping.range.endRow + 1}
                  </div>
                  <div className="text-muted-foreground">
                    {mapping.orientation === 'row-based'
                      ? 'Row-based'
                      : 'Column-based'}
                  </div>
                  <div className="text-muted-foreground">
                    {mapping.isInput ? 'Input' : 'Output'}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Helper functions to build sample data structures
function buildRowBasedData(mapping: RangeMapping): any[] {
  const result: any[] = [];
  const colCount =
    mapping.range.endColumn - mapping.range.startColumn + 1;
  const rowCount = mapping.range.endRow - mapping.range.startRow + 1;

  // Each row is an object
  for (let i = 0; i < rowCount; i++) {
    const obj: Record<string, any> = {};
    for (let j = 0; j < colCount; j++) {
      const colIndex = mapping.range.startColumn + j;
      const attributeName =
        mapping.attributes[colIndex] || `col_${colIndex}`;
      obj[attributeName] = `<value>`;
    }
    result.push(obj);
  }

  return result;
}

function buildColumnBasedData(mapping: RangeMapping): any[] {
  const result: any[] = [];
  const colCount =
    mapping.range.endColumn - mapping.range.startColumn + 1;
  const rowCount = mapping.range.endRow - mapping.range.startRow + 1;

  // Each column is an object
  for (let j = 0; j < colCount; j++) {
    const obj: Record<string, any> = {};
    for (let i = 0; i < rowCount; i++) {
      const rowIndex = mapping.range.startRow + i;
      const attributeName =
        mapping.attributes[rowIndex] || `row_${rowIndex}`;
      obj[attributeName] = `<value>`;
    }
    result.push(obj);
  }

  return result;
}
