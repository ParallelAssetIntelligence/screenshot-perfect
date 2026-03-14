import consolidatedSchema from './consolidated_schema.json';
import type { UADField, PhaseCode, PhaseMetadata } from '@/types/inspection';

// Define phase mapping based on actual URAR report sections (matching reference UI)
const PHASE_MAPPING: Record<string, { code: PhaseCode; name: string; subtitle: string; icon: string }> = {
  'Assignment Information': { code: 'P1', name: 'Assignment Information', subtitle: 'Borrower & Lender', icon: '' },
  'Subject Property': { code: 'P2', name: 'Subject Property', subtitle: 'Property Description', icon: '' },
  'Site': { code: 'P3', name: 'Site', subtitle: 'Site Information', icon: '' },
  'Dwelling Exterior': { code: 'P4', name: 'Dwelling Exterior', subtitle: 'Exterior Features', icon: '' },
  'Unit Interior': { code: 'P5', name: 'Unit Interior', subtitle: 'Interior Features', icon: '' },
  'Sales Comparison Approach': { code: 'P6', name: 'Sales Comparison Approach', subtitle: 'Comparables', icon: '' },
  'Reconciliation': { code: 'P7', name: 'Reconciliation', subtitle: 'Final Value', icon: '' },
  'Appraiser': { code: 'P8', name: 'Appraiser', subtitle: 'Certification', icon: '' },
};

// Map XML field types to input types
function mapFieldType(schemaField: any): 'Text' | 'LongText' | 'Number' | 'Enum' | 'EnumList' | 'Photo' | 'Rating' {
  const fieldName = schemaField.field_name.toLowerCase();

  // Photo fields
  if (fieldName.includes('image') || fieldName.includes('photo') || fieldName.includes('picture')) {
    return 'Photo';
  }

  // Rating fields
  if (fieldName.includes('rating') || fieldName.includes('quality') || fieldName.includes('condition')) {
    return 'Rating';
  }

  // Based on field type from schema
  if (schemaField.type === 'options') {
    return schemaField.options.length <= 5 ? 'Enum' : 'EnumList';
  }

  if (schemaField.type === 'free_text') {
    // Check if it's a long text field
    const longTextKeywords = ['description', 'comment', 'commentary', 'detail', 'narrative', 'explanation'];
    const isLongText = longTextKeywords.some(keyword => fieldName.includes(keyword));
    return isLongText ? 'LongText' : 'Text';
  }

  if (schemaField.type === 'constant') {
    // If constant has options-like values, treat as enum
    return 'Text';
  }

  // Check for numeric fields
  const numericKeywords = ['amount', 'count', 'number', 'size', 'area', 'measure', 'year', 'sqft'];
  if (numericKeywords.some(keyword => fieldName.includes(keyword))) {
    return 'Number';
  }

  return 'Text';
}

// Organize fields into phases based on their semantic meaning
function getPhaseForField(fieldName: string): PhaseCode {
  const name = fieldName.toLowerCase();

  // P1 - Assignment Information (borrower, lender, purpose, contract)
  if (name.includes('borrower') || name.includes('lender') || name.includes('client') ||
      name.includes('assignment') || name.includes('contract') || name.includes('listing') ||
      name.includes('effective') || name.includes('appraisalreporteffectivedate')) {
    return 'P1';
  }

  // P2 - Subject Property (address, property rights, zoning, property type)
  if (name.includes('propertyright') || name.includes('units') || name.includes('accessorydwelling') ||
      name.includes('address') || name.includes('city') || name.includes('state') ||
      name.includes('postal') || name.includes('county') || name.includes('legal') ||
      name.includes('ownership') || name.includes('pud') || name.includes('condo') ||
      name.includes('cooperative') || name.includes('propertyvaluation')) {
    return 'P2';
  }

  // P3 - Site (location, utilities, site size, topography, access)
  if (name.includes('site') || name.includes('zoning') || name.includes('parcel') ||
      name.includes('access') || name.includes('view') || name.includes('utilities') ||
      name.includes('street') || name.includes('topography') || name.includes('broadband') ||
      name.includes('electricity') || name.includes('water') || name.includes('sewer') ||
      name.includes('gas')) {
    return 'P3';
  }

  // P4 - Dwelling Exterior (structure, exterior, foundation, roof, systems)
  if (name.includes('dwelling') || name.includes('structure') || name.includes('construction') ||
      name.includes('story') || name.includes('level') || name.includes('style') ||
      name.includes('design') || name.includes('architectural') || name.includes('foundation') ||
      name.includes('exterior') || name.includes('roof') || name.includes('heating') ||
      name.includes('cooling') || name.includes('hvac') || name.includes('mechanical') ||
      name.includes('amenity') || name.includes('garage') || name.includes('carstorage') ||
      name.includes('pool') || name.includes('basement')) {
    return 'P4';
  }

  // P5 - Unit Interior (rooms, finishes, bathrooms, kitchens)
  if (name.includes('interior') || name.includes('room') || name.includes('kitchen') ||
      name.includes('bath') || name.includes('bedroom') || name.includes('floor') ||
      name.includes('ceiling') || name.includes('wall') || name.includes('finish') ||
      name.includes('appliance') || name.includes('fireplace') || name.includes('attic')) {
    return 'P5';
  }

  // P8 - Appraiser (appraiser info, license, certification, signature) - CHECK FIRST!
  if (name.includes('appraiser') || name.includes('license') || name.includes('certification') ||
      name.includes('signature') || name.includes('supervisory') || name.includes('company') ||
      name.includes('credential') || name.includes('inspection')) {
    return 'P8';
  }

  // P6 - Sales Comparison (comparable sales, adjustments)
  if (name.includes('comparable') || name.includes('sales') || name.includes('adjustment') ||
      name.includes('comp') || name.includes('datasource') || name.includes('proximity') ||
      name.includes('salesprice') || name.includes('priceperunit')) {
    return 'P6';
  }

  // P7 - Reconciliation (market analysis, value opinion, reconciliation)
  if (name.includes('reconciliation') || name.includes('market') || name.includes('opinion') ||
      name.includes('value') || name.includes('final') || name.includes('indication') ||
      name.includes('approach') || name.includes('cost') || name.includes('income')) {
    return 'P7';
  }

  // Default to P2 (Subject Property) for unclassified fields
  return 'P2';
}

// Create human-readable labels from field names
function createLabel(fieldName: string): string {
  // Special cases
  const labelMap: Record<string, string> = {
    'PropertyValuationMethodType': 'Property Valuation Method',
    'AppraisalReportEffectiveDate': 'Effective Date of Appraisal',
    'BorrowerName': 'Borrower Name',
    'AccessoryDwellingUnitIndicator': 'Accessory Dwelling Units',
    'PropertyRightsAppraisedType': 'Property Rights Appraised',
    'ZoningComplianceType': 'Zoning Compliance',
    'ArchitecturalDesignCategoryType': 'Architectural Design',
    'BroadbandInternetAvailableIndicator': 'Broadband Internet Available',
  };

  if (labelMap[fieldName]) {
    return labelMap[fieldName];
  }

  // Convert camelCase/PascalCase to readable format
  return fieldName
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .replace(/Type$/, '')
    .replace(/Indicator$/, '')
    .trim();
}

// Transform consolidated schema to UADField format
export function getFieldsFromSchema(): UADField[] {
  const fields: UADField[] = [];
  let fieldCounter = 1;

  Object.entries(consolidatedSchema.field_definitions).forEach(([fieldName, fieldDef]: [string, any]) => {
    // Skip utility fields
    if (fieldName.length < 3 || fieldName === 'label' || fieldName === 'value') {
      return;
    }

    const phase = getPhaseForField(fieldName);
    const inputType = mapFieldType(fieldDef);
    const label = createLabel(fieldName);

    // Prepare possible answers
    let possibleAnswers = '';
    if (fieldDef.type === 'options' && fieldDef.options && fieldDef.options.length > 0) {
      possibleAnswers = fieldDef.options.join(', ');
    } else if (fieldDef.type === 'constant' && fieldDef.default_value) {
      possibleAnswers = fieldDef.default_value;
    }

    // Map phase to section name (matching URAR report structure)
    const sectionMap: Record<PhaseCode, string> = {
      'P1': 'Assignment Information',
      'P2': 'Subject Property',
      'P3': 'Site',
      'P4': 'Dwelling Exterior',
      'P5': 'Unit Interior',
      'P6': 'Sales Comparison Approach',
      'P7': 'Reconciliation',
      'P8': 'Appraiser'
    };

    const field: UADField = {
      id: `field_${fieldCounter}`,
      field_num: `${phase}.${fieldCounter.toString().padStart(3, '0')}`,
      phase: phase,
      uad_section: sectionMap[phase],
      section_num: fieldCounter,
      report_field_id: fieldName,
      report_label: label,
      appsheet_column: fieldName,
      input_type: inputType,
      possible_answers: possibleAnswers || undefined,
      required: fieldDef.type === 'constant' ? 'Yes' : 'No',
      show_if: undefined,
      data_source: undefined,
      in_questionnaire: 'Yes',
      when_to_include: undefined,
      allowable_answers_format: fieldDef.type === 'options' ? 'Enum' : undefined,
      definition_guidance: fieldDef.examples && fieldDef.examples.length > 0
        ? `Examples: ${fieldDef.examples.slice(0, 3).join(', ')}`
        : undefined,
      dev_status: 'Active',
      dev_notes: `Type: ${fieldDef.type}, Samples: ${fieldDef.sample_count}`,
      help_text: undefined,
      help_text_priority: undefined,
      uad_conditionality: undefined,
    };

    fields.push(field);
    fieldCounter++;
  });

  return fields;
}

// Get fields by phase
export function getFieldsByPhase(phase: PhaseCode): UADField[] {
  const allFields = getFieldsFromSchema();
  return allFields.filter(field => field.phase === phase);
}

// Get all phases
export function getAllPhases(): PhaseMetadata[] {
  return Object.values(PHASE_MAPPING).map((phase, index) => ({
    id: `phase_${index + 1}`,
    code: phase.code,
    name: phase.name,
    subtitle: phase.subtitle,
    icon: phase.icon,
    display_order: index + 1,
  }));
}

// Get phase metadata
export function getPhaseMetadata(code: PhaseCode): PhaseMetadata | undefined {
  const phase = Object.values(PHASE_MAPPING).find(p => p.code === code);
  if (!phase) return undefined;

  const index = Object.values(PHASE_MAPPING).findIndex(p => p.code === code);
  return {
    id: `phase_${index + 1}`,
    code: phase.code,
    name: phase.name,
    subtitle: phase.subtitle,
    icon: phase.icon,
    display_order: index + 1,
  };
}
