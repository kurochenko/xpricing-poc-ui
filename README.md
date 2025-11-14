# XPricing PoC - Excel REST API Mapping Interface

A proof-of-concept application that demonstrates an innovative UX for mapping Excel ranges to REST API requests/responses using UniverJS.

## Overview

XPricing wraps Excel files with a REST API, preserving business logic while making it immutable, deterministic, and scalable. This PoC provides an intuitive interface for:

- Selecting ranges in a spreadsheet (UniverJS)
- Configuring how ranges map to API structures
- Real-time visualization of API request/response JSON

## Features

### 1. **Spreadsheet Integration**
- Built with UniverJS for full Excel compatibility
- Sample data pre-loaded with formulas
- Interactive spreadsheet editing

### 2. **Range Selection & Mapping**
- Press **Ctrl+M** (or **Cmd+M** on Mac) after selecting cells to create a mapping
- Tool panel appears near selection for configuration

### 3. **Tool Panel**
Provides controls for:
- **Array Orientation**: Choose between row-based or column-based arrays
  - Row-based: Each row is an object (outer array = rows)
  - Column-based: Each column is an object (outer array = columns)
- **Add/Remove Rows & Columns**: Dynamically adjust range size
- **Attribute Naming**: Name each row/column as API attributes
- **Drag to Reposition**: Move range to different location (visual indicator)

### 4. **Real-time API Preview**
- Sidebar shows live request/response JSON structure
- Updates immediately as you modify mappings
- Copy JSON to clipboard with one click
- Visual distinction between input (request) and output (response) mappings

### 5. **Modern Tech Stack**
- **React 19** with TypeScript
- **Vite** for fast development
- **UniverJS** for spreadsheet functionality
- **Tailwind CSS** for styling
- **shadcn/ui** components
- **Zod** for validation
- **React Hook Form** for forms
- **TanStack Query** ready for API integration

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Usage

1. **Open the application** - The spreadsheet loads with sample data
2. **Select a range** - Click and drag to select cells in the spreadsheet
3. **Press Ctrl+M** (or Cmd+M) to create a mapping
4. **Configure mapping**:
   - Enter a mapping name (e.g., "products", "results")
   - Choose Input (request) or Output (response)
   - Click "Save Mapping"
5. **Use the Tool Panel**:
   - Toggle between row-based and column-based orientation
   - Add/remove rows and columns
   - Name attributes for each row/column
6. **View API structure** - Check the sidebar for real-time JSON preview
7. **Copy JSON** - Use the copy button to export the structure

## Architecture

```
src/
├── components/
│   ├── ui/              # Reusable UI components (shadcn)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   └── label.tsx
│   └── spreadsheet/     # Spreadsheet-specific components
│       ├── Spreadsheet.tsx  # UniverJS integration
│       ├── ToolPanel.tsx    # Range configuration panel
│       └── APISidebar.tsx   # API preview sidebar
├── types/
│   └── index.ts         # TypeScript definitions
├── lib/
│   └── utils.ts         # Utility functions
└── App.tsx             # Main application component
```

## Key Concepts

### Range Mapping
A range mapping connects a spreadsheet range to an API field:

```typescript
interface RangeMapping {
  id: string;
  range: CellRange;              // A1:D4
  name: string;                  // "products"
  orientation: ArrayOrientation; // "row-based" | "column-based"
  attributes: Record<number, string>; // Column/row names
  isInput: boolean;              // Request vs Response
}
```

### Array Orientation

**Row-based** (default):
```json
{
  "products": [
    { "name": "Item A", "quantity": 10, "price": 25.5 },
    { "name": "Item B", "quantity": 5, "price": 42.0 }
  ]
}
```

**Column-based**:
```json
{
  "metrics": [
    { "q1": 100, "q2": 150, "q3": 200 },
    { "q1": 80, "q2": 120, "q3": 180 }
  ]
}
```

## Future Enhancements

- [ ] Actual range selection from UniverJS (currently uses Ctrl+M for PoC)
- [ ] Drag-and-drop range repositioning
- [ ] Excel file upload/import
- [ ] Save/load mapping configurations
- [ ] API endpoint testing
- [ ] Multi-sheet support
- [ ] Nested object/array structures
- [ ] Validation rules
- [ ] Export mapping as JSON schema

## Technical Notes

- UniverJS facade API is not used due to version compatibility
- Keyboard shortcut (Ctrl+M) used for range selection in PoC
- Tool panel position is fixed for demonstration
- Build warnings about @import order can be ignored (PostCSS strictness)

## License

This is a proof-of-concept for demonstration purposes.

## Contribution

This PoC demonstrates the core concept. For production implementation:
1. Integrate proper UniverJS selection API
2. Add real drag-and-drop with visual feedback
3. Implement persistent storage
4. Add comprehensive validation
5. Connect to actual XPricing backend
