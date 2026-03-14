# Section Names Update

## Changes Made

The application now uses proper URAR (Uniform Residential Appraisal Report) section names instead of generic phase names.

### Before vs After

| Phase | Old Name | New Name |
|-------|----------|----------|
| **P1** | Pre-Inspection | **Assignment Information** |
| **P2** | Arrival | **Subject Property** |
| **P3** | Preliminary Exterior | **Site** |
| **P4** | Interior | **Improvements** |
| **P5** | Detailed Exterior | **Interior** |
| **P6** | Site | **Sales Comparison** |
| **P7** | Energy & Certs | **Reconciliation** |
| **P8** | Final | **Appraiser** |

## Section Details

### P1 - Assignment Information
**Subtitle:** Borrower, Lender, Purpose
**Fields Include:**
- Borrower Name
- Lender/Client Information
- Assignment Reason
- Contract Price
- Listing Status
- Effective Date of Appraisal

### P2 - Subject Property
**Subtitle:** Address & Description
**Fields Include:**
- Property Address
- Property Rights Appraised
- Property Valuation Method
- Units Excluding ADUs
- Accessory Dwelling Units
- PUD/Condo/Cooperative indicators
- Legal Description

### P3 - Site
**Subtitle:** Location & Utilities
**Fields Include:**
- Site Size
- Zoning Compliance
- Utilities (Electric, Gas, Water, Sewer)
- Access Type & Street
- View
- Topography
- Broadband Internet Available

### P4 - Improvements
**Subtitle:** Dwelling & Structure
**Fields Include:**
- Dwelling Style
- Construction Type
- Stories/Levels
- Foundation Type
- Roof Type
- Heating/Cooling Systems
- Exterior Materials
- Garage/Car Storage
- Basement
- Pool/Amenities

### P5 - Interior
**Subtitle:** Rooms & Finishes
**Fields Include:**
- Number of Rooms
- Bedrooms/Bathrooms
- Kitchen
- Flooring
- Walls/Ceilings
- Appliances
- Fireplace
- Attic
- Interior Finishes

### P6 - Sales Comparison
**Subtitle:** Comparable Sales
**Fields Include:**
- Comparable Sales (Comp 1, 2, 3)
- Sales Price
- Adjustments
- Data Source
- Proximity to Subject
- Price Per Unit

### P7 - Reconciliation
**Subtitle:** Value Conclusion
**Fields Include:**
- Opinion of Market Value
- Reconciliation Commentary
- Market Analysis
- Final Value Indication
- Approaches to Value (Sales, Cost, Income)

### P8 - Appraiser
**Subtitle:** Certification & Signatures
**Fields Include:**
- Appraiser Name
- Appraiser Company
- License Number
- Certification Level
- License State
- License Expiration
- Inspection Type (Interior/Exterior)
- Supervisor Information

## Field Assignment Logic

Fields are automatically assigned to sections based on keywords in their names:

```typescript
// Examples:
"BorrowerName" → P1 (Assignment Information)
"PropertyRightsAppraisedType" → P2 (Subject Property)
"ZoningComplianceType" → P3 (Site)
"DwellingStyleType" → P4 (Improvements)
"InteriorFinishType" → P5 (Interior)
"ComparableSalePrice" → P6 (Sales Comparison)
"OpinionOfMarketValue" → P7 (Reconciliation)
"AppraiserLicenseType" → P8 (Appraiser)
```

## How It Appears in UI

The navigation sidebar will now show:

```
PHASES
┌─────────────────────────────────┐
│ 📋 Assignment Information       │
│    Borrower, Lender, Purpose    │
├─────────────────────────────────┤
│ 🏠 Subject Property             │
│    Address & Description        │
├─────────────────────────────────┤
│ 🌳 Site                          │
│    Location & Utilities         │
├─────────────────────────────────┤
│ 🏗️ Improvements                  │
│    Dwelling & Structure         │
├─────────────────────────────────┤
│ 🏡 Interior                      │
│    Rooms & Finishes             │
├─────────────────────────────────┤
│ 📊 Sales Comparison              │
│    Comparable Sales             │
├─────────────────────────────────┤
│ ✅ Reconciliation                │
│    Value Conclusion             │
├─────────────────────────────────┤
│ ✍️ Appraiser                     │
│    Certification & Signatures   │
└─────────────────────────────────┘
```

## Files Modified

- ✅ `src/data/schemaAdapter.ts`
  - Updated `PHASE_MAPPING` with proper section names
  - Updated `getPhaseForField()` logic for better field assignment
  - Added `sectionMap` for UAD section names
  - Reordered field checks to prevent conflicts

## Testing

```bash
cd screenshot-perfect
npm run build  # ✅ Build successful
npm run dev    # Start dev server
```

## Benefits

✅ **Matches Industry Standards** - Uses official URAR section names
✅ **Better Organization** - Fields logically grouped by appraisal section
✅ **Clearer Navigation** - Users understand what each section contains
✅ **Professional Appearance** - Aligns with appraiser expectations

## Notes

- Section names match the standard Uniform Residential Appraisal Report (URAR) format
- Fields are auto-assigned to sections based on semantic analysis
- The `uad_section` field in each UADField now contains the proper section name
- All 882 fields have been remapped to the new section structure
