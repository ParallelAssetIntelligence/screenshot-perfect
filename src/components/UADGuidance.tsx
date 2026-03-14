import { PhaseCode } from '@/types/inspection';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface UADGuidanceProps {
  currentPhase: PhaseCode;
}

interface GuidanceSection {
  title: string;
  content: string | string[];
}

const PHASE_GUIDANCE: Record<PhaseCode, {
  title: string;
  description: string;
  checkboxes?: { id: string; label: string }[];
  actions?: { label: string }[];
  additionalSections?: GuidanceSection[];
}> = {
  P1: {
    title: 'Assignment Information',
    description: 'Borrowers, Sellers and Current Owners may be individuals or legal entities. If required to disclose appraiser and AMC fees, enable the fields below:',
    checkboxes: [
      { id: 'appraiser_fee', label: 'Include Appraiser Fee (If required by law)' },
      { id: 'amc_fee', label: 'Include AMC Fee (If required by law)' },
      { id: 'gov_agency', label: 'Show Government Agency' },
      { id: 'investor_id', label: 'Include Investor Requested Special ID' }
    ],
    actions: [
      { label: 'Borrower' },
      { label: 'Seller' },
      { label: 'Lender' },
      { label: 'EMC' },
      { label: 'Broker' }
    ],
    additionalSections: [
      {
        title: 'Assignment Reason Examples',
        content: [
          'Purchase - Property being purchased',
          'Refinance - Existing loan being refinanced',
          'Estate Settlement - Property in estate',
          'Divorce Settlement - Property division',
          'Condemnation - Eminent domain taking',
          'Other - Specify if different reason'
        ]
      },
      {
        title: 'Property Valuation Methods',
        content: [
          'Desktop Appraisal - No physical inspection',
          'Exterior Inspection - Outside only',
          'Interior Inspection - Full interior access'
        ]
      }
    ]
  },
  P2: {
    title: 'Subject Property',
    description: 'Provide complete property address conforming to USPS Publication 28 standards. Specify property rights appraised and property type characteristics.',
    actions: [],
    additionalSections: [
      {
        title: 'Property Rights Appraised',
        content: [
          'Fee Simple - Full ownership of land and improvements',
          'Leasehold - Rights under lease agreement',
          'Life Estate - Ownership rights for lifetime only'
        ]
      },
      {
        title: 'Property Type Definitions',
        content: [
          'PUD (Planned Unit Development) - Residential cluster with HOA-owned common areas',
          'Condominium - Individual unit ownership with shared common elements',
          'Cooperative - Share ownership in corporation owning the building',
          'Condop - Hybrid of condo and co-op ownership',
          'ADU (Accessory Dwelling Unit) - Additional living space on same lot'
        ]
      }
    ]
  },
  P3: {
    title: 'Site',
    description: 'Document site size, zoning compliance, utilities, and access type. Include view and topography information.',
    actions: [],
    additionalSections: [
      {
        title: 'Site Influence Impact Ratings',
        content: [
          'Beneficial - Positive impact on property value',
          'Neutral - No significant impact on value',
          'Adverse - Negative impact on property value'
        ]
      },
      {
        title: 'Common Site Influences',
        content: [
          'Golf Course, Park, Water/Waterfront',
          'Commercial, Industrial, High-Traffic Road',
          'School, Place of Worship, Airport',
          'Power Lines, Railroad, Landfill'
        ]
      },
      {
        title: 'Proximity Levels',
        content: 'Onsite | Bordering | Adjacent | Within 1 Block | Within 1 Mile | Greater than 1 Mile'
      }
    ]
  },
  P4: {
    title: 'Improvements',
    description: 'Detail dwelling style, construction type, stories, foundation, roof, heating/cooling systems, and exterior materials.',
    actions: [],
    additionalSections: [
      {
        title: 'Measurement Standards',
        content: [
          'ANSI (American National Standards Institute) - Industry standard for residential measurement',
          'AMS (American Measurement Standard) - Alternative measurement standard',
          'Other (Describe) - Use if state law mandates a different standard'
        ]
      },
      {
        title: 'Common Dwelling Styles',
        content: [
          'Ranch, Colonial, Cape Cod, Contemporary',
          'Split Level, Split Entry, Bi-Level',
          'Victorian, Tudor, Mediterranean',
          'Bungalow, Craftsman, Other'
        ]
      },
      {
        title: 'Construction Methods',
        content: 'Site Built | Manufactured | Modular | Log | Dome | Adobe | Other'
      }
    ]
  },
  P5: {
    title: 'Interior',
    description: 'Document rooms, bedrooms, bathrooms, kitchen, flooring, walls/ceilings, appliances, and interior finishes.',
    actions: [],
    additionalSections: [
      {
        title: 'Area Definitions',
        content: [
          'Above Grade - Living space with exterior walls at or above ground level',
          'Below Grade - Living space with exterior walls below ground level (basement)',
          'Finished Area - Space with flooring, walls, ceiling, heating, and livable conditions',
          'Unfinished Area - Space lacking one or more elements of finished area'
        ]
      },
      {
        title: 'Quality Ratings (Q1-Q6)',
        content: [
          'Q1 - High Quality: Premium materials, superior design and craftsmanship',
          'Q2 - Good Quality: Above average materials and workmanship',
          'Q3 - Average Quality: Standard builder-grade materials (most common)',
          'Q4 - Fair Quality: Modest materials and simple design',
          'Q5 - Poor Quality: Low-grade materials and workmanship',
          'Q6 - Unsound: Substandard construction, major defects'
        ]
      },
      {
        title: 'Condition Ratings (C1-C6)',
        content: [
          'C1 - New or Like New: 0-1 years old, no visible wear',
          'C2 - Well Maintained: Good condition, minor wear, well kept',
          'C3 - Average: Normal wear and tear for age (most common)',
          'C4 - Fair: Some deferred maintenance, wear is evident',
          'C5 - Poor: Significant deferred maintenance, major wear',
          'C6 - Unsound: Critical repairs needed, may not be habitable'
        ]
      }
    ]
  },
  P6: {
    title: 'Sales Comparison',
    description: 'Provide comparable sales data including sales price, adjustments, proximity to subject, and data sources.',
    actions: [],
    additionalSections: [
      {
        title: 'Comparable Selection Criteria',
        content: [
          'Similar location and neighborhood',
          'Comparable size and style',
          'Similar age and condition',
          'Recent sale date (typically within 12 months)',
          'Arms-length transaction'
        ]
      },
      {
        title: 'Common Adjustments',
        content: [
          'Sale or Financing Concessions',
          'Date of Sale/Time',
          'Location',
          'Site/View',
          'Design and Appeal',
          'Quality of Construction',
          'Age/Condition',
          'Above Grade Living Area',
          'Below Grade Living Area',
          'Functional Utility',
          'Heating/Cooling',
          'Garage/Car Storage'
        ]
      }
    ]
  },
  P7: {
    title: 'Reconciliation',
    description: 'Provide opinion of market value, reconciliation commentary, market analysis, and final value indication.',
    actions: [],
    additionalSections: [
      {
        title: 'Disaster Mitigation Features',
        content: [
          'Definition: Features added to, or modifications made to, the property that are designed to prevent or reduce the impacts and risks of hazards caused by natural disasters.',
          '',
          'Common Examples:',
          '• Impact Resistant Glass/Windows',
          '• Impact Resistant Shingles/Roof',
          '• Hurricane Straps/Ties',
          '• Earthquake Retrofitting',
          '• Flood Vents',
          '• Fire Sprinklers',
          '• Safe Room/Storm Shelter',
          '• Seismic Gas Shutoff Valve'
        ]
      },
      {
        title: 'Renewable Energy Components',
        content: [
          'Solar Panels (Photovoltaic)',
          'Solar Hot Water System',
          'Geothermal Heating/Cooling',
          'Wind Turbine',
          'Other renewable systems'
        ]
      },
      {
        title: 'Ownership Types',
        content: [
          'Owned - Purchased and owned by property owner',
          'Leased - Under lease agreement',
          'PPA (Power Purchase Agreement) - Third-party owned, property owner purchases power'
        ]
      },
      {
        title: 'Building Certifications',
        content: [
          'LEED (US Green Building Council)',
          'Energy Star',
          'NGBS (National Green Building Standard)',
          'HERS Rating',
          'Living Building Challenge',
          'Other certifications'
        ]
      }
    ]
  },
  P8: {
    title: 'Appraiser',
    description: 'Complete appraiser certification including name, company, license information, and inspection type.',
    actions: [
      { label: 'Appraiser' },
      { label: 'Supervisor/Co-Appraiser' }
    ],
    additionalSections: [
      {
        title: 'Functional Obsolescence',
        content: [
          'Definition: Loss of value due to outdated design, layout, or features that don\'t meet current market standards.',
          '',
          'Types of Functional Issues:',
          '• Ceiling Height - Non-standard or inadequate height',
          '• Floor Plan - Poor layout, flow, or room arrangement',
          '• Nonconformity - Doesn\'t match neighborhood standards',
          '• Overimprovement - Improvements exceed neighborhood norms',
          '• Underimprovement - Insufficient improvements for the site',
          '• Other - Describe other functional deficiencies'
        ]
      },
      {
        title: 'Appraiser Certification Levels',
        content: [
          'Certified Residential - Can appraise 1-4 unit residential',
          'Certified General - Can appraise all property types',
          'Licensed - Limited scope residential appraisal',
          'Trainee/Apprentice - Working under supervision'
        ]
      },
      {
        title: 'Inspection Types',
        content: [
          'Interior and Exterior - Full interior access',
          'Exterior Only - Outside inspection only',
          'Desktop - No physical inspection performed'
        ]
      }
    ]
  }
};

function ExpandableSection({ title, content }: GuidanceSection) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="border border-gray-200 rounded">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-3 py-2 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
      >
        <span className="text-sm font-medium text-gray-900">{title}</span>
        {isExpanded ? (
          <ChevronDown className="h-4 w-4 text-gray-500" />
        ) : (
          <ChevronRight className="h-4 w-4 text-gray-500" />
        )}
      </button>
      {isExpanded && (
        <div className="px-3 py-2 border-t border-gray-200 bg-gray-50">
          {Array.isArray(content) ? (
            <ul className="space-y-1.5 text-xs text-gray-700">
              {content.map((item, idx) => (
                <li key={idx} className={item.startsWith('•') || item.startsWith('Definition:') || item === '' ? '' : 'ml-2'}>
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-gray-700">{content}</p>
          )}
        </div>
      )}
    </div>
  );
}

export function UADGuidance({ currentPhase }: UADGuidanceProps) {
  const guidance = PHASE_GUIDANCE[currentPhase];

  return (
    <aside className="w-80 bg-white border-l border-gray-200 flex flex-col shrink-0">
      {/* Header */}
      <div className="px-4 py-3 bg-black">
        <h3 className="text-sm font-semibold text-white">
          UAD Guidance
        </h3>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          {/* Section Title */}
          <h4 className="text-lg font-semibold text-gray-900">
            {guidance.title}
          </h4>

          {/* Description */}
          <p className="text-sm text-gray-700 leading-relaxed">
            {guidance.description}
          </p>

          {/* Checkboxes */}
          {guidance.checkboxes && guidance.checkboxes.length > 0 && (
            <div className="space-y-3 pt-2">
              {guidance.checkboxes.map((checkbox) => (
                <div key={checkbox.id} className="flex items-start space-x-2">
                  <Checkbox id={checkbox.id} className="mt-0.5" />
                  <label
                    htmlFor={checkbox.id}
                    className="text-sm text-gray-700 cursor-pointer leading-tight"
                  >
                    {checkbox.label}
                  </label>
                </div>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          {guidance.actions && guidance.actions.length > 0 && (
            <div className="space-y-2 pt-4">
              {guidance.actions.map((action) => (
                <Button
                  key={action.label}
                  className="w-full bg-[#00A5E6] hover:bg-[#0094CE] text-white"
                  size="default"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {action.label}
                </Button>
              ))}
            </div>
          )}

          {/* Additional Expandable Sections */}
          {guidance.additionalSections && guidance.additionalSections.length > 0 && (
            <div className="space-y-2 pt-4 border-t border-gray-200">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Reference Information
              </p>
              {guidance.additionalSections.map((section, idx) => (
                <ExpandableSection key={idx} {...section} />
              ))}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
