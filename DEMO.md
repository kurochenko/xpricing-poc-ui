# XPricing PoC Demo Guide

## Quick Start

```bash
npm install
npm run dev
```

Then open http://localhost:5173 in your browser.

## Demo Workflow

### Step 1: Explore the Spreadsheet
- The app loads with a sample spreadsheet containing product data
- Notice the formulas in the "Total" column (e.g., =B2*C2)
- You can edit cells, add data, and see formulas calculate automatically

### Step 2: Create Your First Mapping

1. **Select cells** in the spreadsheet (e.g., select the entire product table A1:D4)
2. **Press Ctrl+M** (or Cmd+M on Mac) to trigger the mapping creation
3. **Tool Panel appears** showing the selected range

### Step 3: Configure the Mapping

In the **header section** (top of the page):
- Enter a mapping name: `products`
- Select type: **Input** (this will be part of the request body)
- Click **Save Mapping**

In the **Tool Panel**:
- Try toggling between **Row-based** and **Column-based** orientation
  - Row-based: Each row becomes an object in the array
  - Column-based: Each column becomes an object in the array
- Click **Add Row** buttons to expand the range
- Click **Remove Row** to shrink it
- Same for columns

### Step 4: Name Your Attributes

In the Tool Panel's **Attribute Names** section:
- Click the edit icon next to each column (in row-based mode)
- Name them:
  - A: `product_name`
  - B: `quantity`
  - C: `unit_price`
  - D: `total`
- Press Enter or click the save icon

### Step 5: Check the API Preview

Look at the **right sidebar** (API Preview):
- See the **Request Body** JSON structure
- Notice how it reflects your orientation and attribute names
- Click the copy icon to copy the JSON

### Step 6: Create a Second Mapping (Output)

1. Press **Ctrl+M** again to create another mapping
2. In the header:
   - Name it: `results`
   - Select type: **Output** (this will be part of the response body)
   - Save it

3. The sidebar now shows:
   - Request Body (your `products` input)
   - Response Body (your `results` output)

## Example Use Case

**Scenario**: You have an Excel file that calculates pricing based on product quantities.

**Request (Input)**:
```json
{
  "products": [
    {
      "product_name": "Item A",
      "quantity": 10,
      "unit_price": 25.5,
      "total": 255
    },
    {
      "product_name": "Item B",
      "quantity": 5,
      "unit_price": 42.0,
      "total": 210
    }
  ]
}
```

**Response (Output)**:
```json
{
  "results": [
    { "discount": 5, "final_price": 242.25 },
    { "discount": 3, "final_price": 203.7 }
  ]
}
```

The XPricing backend would:
1. Receive the request JSON
2. Populate the Excel ranges with the data
3. Execute the Excel formulas
4. Extract the output ranges
5. Return the response JSON

## Key Features Demonstrated

### 1. Range Selection
- **Current**: Keyboard shortcut (Ctrl+M) triggers selection
- **Future**: Real-time selection tracking from UniverJS

### 2. Array Orientation
- **Row-based**: `[{col1: val, col2: val}, {col1: val, col2: val}]`
- **Column-based**: `[{row1: val, row2: val}, {row1: val, row2: val}]`

### 3. Attribute Naming
- Click to edit any column/row name
- Names become JSON keys in the API structure
- Inline editing with save/cancel

### 4. Dynamic Range Sizing
- Add rows before/after current range
- Add columns before/after current range
- Remove rows/columns (with minimum size protection)

### 5. Real-time Preview
- JSON updates immediately as you make changes
- Copy to clipboard for testing
- Visual distinction between request/response

### 6. Multiple Mappings
- Create as many mappings as needed
- Mix input and output mappings
- See all active mappings in the sidebar

## Testing Scenarios

### Test 1: Row-based Product List
1. Map A1:D4 as "products" (Input, Row-based)
2. Name columns: name, qty, price, total
3. Verify JSON shows array of product objects

### Test 2: Column-based Time Series
1. Create new data: Quarters across columns (Q1, Q2, Q3, Q4)
2. Map as "quarterly_data" (Output, Column-based)
3. Each column becomes an object with row names as keys

### Test 3: Mixed Input/Output
1. Create input mapping for parameters
2. Create output mapping for results
3. Verify sidebar shows both request and response sections

### Test 4: Dynamic Range Adjustment
1. Create a mapping
2. Add 2 rows
3. Add 1 column
4. Remove 1 row
5. Watch the JSON structure update in real-time

## Keyboard Shortcuts

- **Ctrl+M** / **Cmd+M**: Create mapping from selected cells
- **Escape**: Close tool panel
- **Enter**: Save attribute name (when editing)

## UX Highlights

✨ **Immediate Feedback**: JSON updates as you type
✨ **Contextual UI**: Tool panel appears near your selection
✨ **Visual Distinction**: Color-coded input (blue) vs output (green) in sidebar
✨ **Inline Editing**: Edit attribute names without modal dialogs
✨ **Copy-friendly**: One-click JSON copy to clipboard
✨ **Non-destructive**: Multiple mappings don't interfere with each other

## Next Steps for Production

1. **Integrate UniverJS Selection API**
   - Replace keyboard shortcut with real selection tracking
   - Show visual highlight of selected range
   - Update tool panel position based on actual cell coordinates

2. **Drag & Drop**
   - Enable drag handle on tool panel
   - Show ghost outline while dragging
   - Update range when dropped

3. **Excel File Upload**
   - Add file picker
   - Parse and load Excel files into UniverJS
   - Preserve formulas and formatting

4. **Persistence**
   - Save mappings to local storage or backend
   - Export/import mapping configurations
   - Version control for mappings

5. **Validation**
   - Zod schemas for attribute names
   - Range overlap detection
   - Data type inference

6. **API Integration**
   - Connect to XPricing backend
   - Test endpoints with actual requests
   - Show response data in spreadsheet

---

**Enjoy exploring the PoC!** 🚀

For questions or improvements, refer to the main README.md
