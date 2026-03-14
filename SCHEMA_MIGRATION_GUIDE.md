# Schema Migration Guide

## Overview
The application has been migrated from using Supabase for field definitions and phases to using a local consolidated schema generated from XML analysis.

## What Changed

### 1. **Data Source**
- **Before**: Fields and phases were fetched from Supabase database
- **After**: Fields and phases are loaded from `src/data/consolidated_schema.json`

### 2. **Files Added**

#### `src/data/consolidated_schema.json`
- Contains 882 fields extracted from 5 XML appraisal samples (SF1, SF3, SF5, 2-to-4-unit, Condo2)
- Each field includes:
  - `field_name`: Original XML field name
  - `type`: Classification (options, constant, or free_text)
  - `options`: Array of possible values (for option fields)
  - `default_value`: Fixed value (for constant fields)
  - `examples`: Sample values (for free-text fields)
  - `sample_count`: Number of samples containing this field

#### `src/data/schemaAdapter.ts`
- Transforms consolidated schema into UADField format
- Maps XML fields to appropriate phases (P1-P8)
- Converts field types to input types (Text, Enum, Photo, etc.)
- Creates human-readable labels from field names

### 3. **Files Modified**

#### `src/lib/supabase.ts`
- Updated `db.fields.getByPhase()` to use local schema
- Updated `db.fields.getAll()` to use local schema
- Updated `db.phases.getAll()` to use local schema
- **Note**: Inspections, responses, and storage still use Supabase (user data)

#### `tsconfig.app.json`
- Added `"resolveJsonModule": true` to support JSON imports

## Field Organization

### Phases (8 total)
| Phase | Name | Description |
|-------|------|-------------|
| P1 | Pre-Inspection | Arrival - Summary info, borrower, valuation method |
| P2 | Arrival | Site & Outbuildings - Neighborhood, project details |
| P3 | Preliminary Exterior | Dwelling - Structure, style, construction |
| P4 | Interior | Unit Interior - Rooms, finishes, interior features |
| P5 | Detailed Exterior | Systems - HVAC, plumbing, electrical, roof |
| P6 | Site | Systems & Utilities - Site details, utilities, access |
| P7 | Energy & Certs | Energy & Certifications - Green features, efficiency |
| P8 | Final | Wrap Up + Subject - Comparables, adjustments, reconciliation |

### Field Types (from schema)
- **Options Fields (341)**: Fields with 2-20 distinct values
  - Example: `PropertyValuationMethodType` → ["DesktopAppraisal", "TraditionalAppraisal"]
  - Mapped to: `Enum` or `EnumList` input types

- **Constant Fields (265)**: Fields with same value across all samples
  - Example: Single fixed value
  - Mapped to: `Text` input type (pre-filled)

- **Free Text Fields (276)**: Fields with variable text
  - Example: Addresses, descriptions, comments
  - Mapped to: `Text` or `LongText` input types

### Input Type Mapping
| Schema Type | Input Type | Description |
|-------------|------------|-------------|
| options (≤5) | Enum | Radio buttons or single select |
| options (>5) | EnumList | Multi-select dropdown |
| free_text (short) | Text | Single line input |
| free_text (long) | LongText | Textarea |
| *Photo | Photo | Image upload |
| *Rating | Rating | Star or scale rating |

*Auto-detected from field name keywords

## How It Works

### 1. **Application Startup**
```typescript
// usePhases hook loads phases
const phases = getAllPhases(); // From schemaAdapter.ts
// Returns 8 phases with metadata
```

### 2. **Phase Selection**
```typescript
// useFields hook loads fields for selected phase
const fields = getFieldsByPhase('P1'); // From schemaAdapter.ts
// Returns all fields assigned to P1 phase
```

### 3. **Field Rendering**
```typescript
// FormFieldRenderer displays field based on input_type
<FormFieldRenderer
  field={currentField}
  value={store[phase][field.appsheet_column]}
  ...
/>
```

### 4. **Field Type Detection**
- Photo fields: field name contains "image", "photo", "picture"
- Rating fields: field name contains "rating", "quality", "condition"
- Number fields: field name contains "amount", "count", "size", "year"
- Long text: field name contains "description", "comment", "commentary"
- Enum: options type with ≤5 choices
- EnumList: options type with >5 choices

## Benefits

### ✅ Advantages
1. **No Database Required**: Works offline, faster loading
2. **Version Control**: Schema changes tracked in Git
3. **Type Safety**: Full TypeScript support
4. **Centralized Data**: Single source of truth from XML analysis
5. **Easy Updates**: Regenerate schema from new XML samples

### 📊 Schema Statistics
- **Total Fields**: 882
- **Options Fields**: 341 (38.7%)
- **Constant Fields**: 265 (30.0%)
- **Free Text Fields**: 276 (31.3%)
- **Samples Analyzed**: 5 (SF1, SF3, SF5, 2-to-4-unit, Condo2)

## Future Enhancements

### Possible Improvements
1. **Add XML Schema Validation**: Validate responses against XML schema
2. **Custom Field Grouping**: Allow custom phase/section organization
3. **Field Dependencies**: Implement show_if conditions from schema
4. **Export to XML**: Generate XML output from form responses
5. **Schema Updates**: Auto-regenerate when XML samples change

## Regenerating Schema

If you need to update the schema from new XML files:

```bash
# 1. Add new XML files to Selected_Appraisal_Files/
cp new_sample.xml Selected_Appraisal_Files/

# 2. Run the analysis script
cd Selected_Appraisal_Files
python analyze_appraisals_v2.py

# 3. Copy updated schema to app
cp consolidated_schema_v2.json ../screenshot-perfect/src/data/consolidated_schema.json

# 4. Rebuild the app
cd ../screenshot-perfect
npm run build
```

## Testing

The application has been tested with:
- ✅ Build compilation
- ✅ TypeScript type checking
- ✅ JSON module imports
- 🔄 Runtime testing (dev server running)

## Notes

- User data (inspections, responses, photos) still uses Supabase
- Only field definitions and phase metadata come from local schema
- Original Supabase integration remains available for user data persistence
