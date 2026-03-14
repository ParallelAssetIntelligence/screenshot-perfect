# Auto-Save Feature Setup

## Overview

The application now auto-saves form data to Supabase in a structured JSON format. All form changes are automatically saved to the database, allowing users to continue their work later.

## Changes Made

### 1. Database Schema Updates

**Added `form_data` column to `inspections` table:**
- Stores complete form data as JSONB
- Format: `{ "P1": { "Field Label": { "label": "Field Label", "value": "..." } } }`
- Allows partial saves (half-filled forms)

### 2. Data Structure

Form data is stored in label-value format similar to `all_page_json.json`:

```json
{
  "P1": {
    "Borrower Name": {
      "label": "Borrower Name",
      "value": ["Mary Jones", "Michael Jones"]
    },
    "Contract Price": {
      "label": "Contract Price",
      "value": "$895,000"
    }
  },
  "P2": {
    "Site Size": {
      "label": "Site Size",
      "value": "13,939 Sq. Ft."
    }
  }
}
```

### 3. Features Implemented

✅ **Auto-save**: Form changes are automatically saved after 1 second of inactivity
✅ **Multi-user support**: Each inspection is linked to the logged-in user
✅ **Multiple reports**: Users can create and manage multiple inspections
✅ **Partial saves**: Half-filled forms are saved and can be continued later
✅ **Label-value format**: Data is stored with human-readable labels

## Setup Instructions

### Step 1: Run Database Migration

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Run the migration script: `supabase_migration_add_form_data.sql`

```sql
-- Add form_data column to inspections table
ALTER TABLE inspections
ADD COLUMN IF NOT EXISTS form_data JSONB DEFAULT '{}'::jsonb;

-- Add index for faster queries
CREATE INDEX IF NOT EXISTS idx_inspections_user_name
ON inspections(user_id, name);
```

### Step 2: Verify the Changes

After running the migration:

1. Go to **Table Editor** in Supabase
2. Select the `inspections` table
3. Verify that the `form_data` column exists

### Step 3: Test the Application

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Log in to the application
3. Create a new inspection or open an existing one
4. Fill in some fields
5. Check Supabase to verify the data is being saved

## How It Works

### Data Flow

1. **User enters data** → Form state updates in React
2. **Auto-save triggers** (1 second debounce) → Converts internal store to label-value format
3. **Data saved to Supabase** → Updates `inspections.form_data` column
4. **User returns later** → Data loaded from Supabase and converted back to internal format

### Key Files Modified

- `src/hooks/useFormState.ts` - Auto-save logic and data conversion
- `src/lib/supabase.ts` - Database methods for saving/loading form data
- `src/integrations/supabase/types.ts` - TypeScript types for form_data column
- `src/types/inspection.ts` - Updated Inspection interface

## Usage

### Creating a New Inspection

```typescript
const inspection = await db.inspections.create({
  user_id: userId,
  name: 'My Appraisal Report',
  current_phase: 'P1',
  current_field_index: 0,
  status: 'in_progress',
  form_data: {}
});
```

### Auto-Save in Action

Every time a field value changes:
1. The change is immediately reflected in the UI
2. After 1 second of no changes, the data is automatically saved
3. The entire form data is converted to label-value format
4. The JSON is saved to `inspections.form_data`

### Loading Existing Inspection

```typescript
const inspection = await db.inspections.getByUserAndName(userId, inspectionName);
// Form data is automatically loaded and converted to internal format
```

## Benefits

✅ **No manual save button** - Users don't have to remember to save
✅ **Never lose work** - Data is automatically preserved
✅ **Continue anytime** - Users can close and return to their work
✅ **Clean data structure** - Human-readable label-value pairs
✅ **Single JSON field** - Easy to export and analyze
✅ **User isolation** - Each user's data is separate
✅ **Multiple reports** - Support for unlimited inspections per user

## Troubleshooting

### Data not saving?

Check the browser console for errors:
- Ensure user is logged in (`userId` is defined)
- Verify inspection name is set
- Check Supabase connection

### Data not loading?

- Verify the inspection exists in Supabase
- Check that `form_data` column has valid JSON
- Ensure field labels match between saved data and schema

### Migration failed?

- Check if the column already exists
- Verify you have proper permissions in Supabase
- Try running each statement separately

## Example Data Output

When you view the `inspections` table in Supabase, you'll see:

| id | user_id | name | status | form_data |
|----|---------|------|--------|-----------|
| uuid-1 | user-123 | Property Appraisal 1 | in_progress | {"P1": {"Borrower Name": {"label": "Borrower Name", "value": "John Doe"}}} |
| uuid-2 | user-123 | Property Appraisal 2 | in_progress | {"P1": {...}, "P2": {...}} |

This format makes it easy to:
- Export to JSON
- Analyze field completion
- Generate reports
- Migrate data if needed
