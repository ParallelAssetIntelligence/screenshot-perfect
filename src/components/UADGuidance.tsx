import { PhaseCode } from '@/types/inspection';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Plus, ChevronDown, ChevronRight, BookOpen } from 'lucide-react';
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
      { label: 'Borrower' }, { label: 'Seller' }, { label: 'Lender' }, { label: 'EMC' }, { label: 'Broker' }
    ],
    additionalSections: [
      { title: 'Assignment Reason Examples', content: ['Purchase - Property being purchased', 'Refinance - Existing loan being refinanced', 'Estate Settlement - Property in estate', 'Divorce Settlement - Property division', 'Condemnation - Eminent domain taking', 'Other - Specify if different reason'] },
      { title: 'Property Valuation Methods', content: ['Desktop Appraisal - No physical inspection', 'Exterior Inspection - Outside only', 'Interior Inspection - Full interior access'] }
    ]
  },
  P2: { title: 'Subject Property', description: 'Provide complete property address conforming to USPS Publication 28 standards.', additionalSections: [{ title: 'Property Rights Appraised', content: ['Fee Simple - Full ownership', 'Leasehold - Rights under lease', 'Life Estate - Ownership for lifetime'] }, { title: 'Property Type Definitions', content: ['PUD - Residential cluster with HOA', 'Condominium - Individual unit ownership', 'Cooperative - Share ownership', 'ADU - Additional living space'] }] },
  P3: { title: 'Site', description: 'Document site size, zoning compliance, utilities, and access type.', additionalSections: [{ title: 'Site Influence Ratings', content: ['Beneficial - Positive impact', 'Neutral - No significant impact', 'Adverse - Negative impact'] }, { title: 'Proximity Levels', content: 'Onsite | Bordering | Adjacent | Within 1 Block | Within 1 Mile | Greater than 1 Mile' }] },
  P4: { title: 'Improvements', description: 'Detail dwelling style, construction type, stories, foundation, roof, heating/cooling systems.', additionalSections: [{ title: 'Measurement Standards', content: ['ANSI - Industry standard', 'AMS - Alternative standard', 'Other - State law mandated'] }, { title: 'Construction Methods', content: 'Site Built | Manufactured | Modular | Log | Dome | Adobe | Other' }] },
  P5: { title: 'Interior', description: 'Document rooms, bedrooms, bathrooms, kitchen, flooring, walls/ceilings, appliances.', additionalSections: [{ title: 'Quality Ratings (Q1-Q6)', content: ['Q1 - High Quality', 'Q2 - Good Quality', 'Q3 - Average Quality', 'Q4 - Fair Quality', 'Q5 - Poor Quality', 'Q6 - Unsound'] }, { title: 'Condition Ratings (C1-C6)', content: ['C1 - New or Like New', 'C2 - Well Maintained', 'C3 - Average', 'C4 - Fair', 'C5 - Poor', 'C6 - Unsound'] }] },
  P6: { title: 'Sales Comparison', description: 'Provide comparable sales data including sales price, adjustments, and data sources.', additionalSections: [{ title: 'Comparable Selection Criteria', content: ['Similar location and neighborhood', 'Comparable size and style', 'Similar age and condition', 'Recent sale date (within 12 months)'] }, { title: 'Common Adjustments', content: ['Sale/Financing Concessions', 'Date of Sale/Time', 'Location', 'Site/View', 'Quality', 'Age/Condition', 'Living Area'] }] },
  P7: { title: 'Reconciliation', description: 'Provide opinion of market value, reconciliation commentary, and final value indication.', additionalSections: [{ title: 'Disaster Mitigation Features', content: ['Impact Resistant Glass', 'Hurricane Straps', 'Earthquake Retrofitting', 'Flood Vents', 'Safe Room'] }, { title: 'Renewable Energy', content: ['Solar Panels', 'Geothermal', 'Wind Turbine'] }] },
  P8: { title: 'Appraiser', description: 'Complete appraiser certification including name, company, and license information.', actions: [{ label: 'Appraiser' }, { label: 'Supervisor/Co-Appraiser' }], additionalSections: [{ title: 'Certification Levels', content: ['Certified Residential', 'Certified General', 'Licensed', 'Trainee/Apprentice'] }, { title: 'Inspection Types', content: ['Interior and Exterior', 'Exterior Only', 'Desktop'] }] }
};

function ExpandableSection({ title, content }: GuidanceSection) {
  const [isExpanded, setIsExpanded] = useState(false);
  return (
    <div className="border border-border rounded">
      <button onClick={() => setIsExpanded(!isExpanded)} className="w-full px-3 py-2 flex items-center justify-between text-left hover:bg-muted transition-colors">
        <span className="text-xs sm:text-sm font-medium text-foreground">{title}</span>
        {isExpanded ? <ChevronDown className="h-4 w-4 text-muted-foreground" /> : <ChevronRight className="h-4 w-4 text-muted-foreground" />}
      </button>
      {isExpanded && (
        <div className="px-3 py-2 border-t border-border bg-muted/50">
          {Array.isArray(content) ? (
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              {content.map((item, idx) => <li key={idx}>{item}</li>)}
            </ul>
          ) : (
            <p className="text-xs text-muted-foreground">{content}</p>
          )}
        </div>
      )}
    </div>
  );
}

function GuidanceContent({ currentPhase }: { currentPhase: PhaseCode }) {
  const guidance = PHASE_GUIDANCE[currentPhase];
  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 bg-foreground">
        <h3 className="text-sm font-semibold text-background">UAD Guidance</h3>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-4">
          <h4 className="text-base sm:text-lg font-semibold text-foreground">{guidance.title}</h4>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{guidance.description}</p>
          {guidance.checkboxes && guidance.checkboxes.length > 0 && (
            <div className="space-y-3 pt-2">
              {guidance.checkboxes.map((cb) => (
                <div key={cb.id} className="flex items-start space-x-2">
                  <Checkbox id={cb.id} className="mt-0.5" />
                  <label htmlFor={cb.id} className="text-xs sm:text-sm text-muted-foreground cursor-pointer leading-tight">{cb.label}</label>
                </div>
              ))}
            </div>
          )}
          {guidance.actions && guidance.actions.length > 0 && (
            <div className="space-y-2 pt-4">
              {guidance.actions.map((action) => (
                <Button key={action.label} className="w-full" size="default">
                  <Plus className="h-4 w-4 mr-2" />
                  {action.label}
                </Button>
              ))}
            </div>
          )}
          {guidance.additionalSections && guidance.additionalSections.length > 0 && (
            <div className="space-y-2 pt-4 border-t border-border">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Reference Information</p>
              {guidance.additionalSections.map((section, idx) => (
                <ExpandableSection key={idx} {...section} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function UADGuidance({ currentPhase }: UADGuidanceProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile: floating button + sheet */}
      <div className="lg:hidden fixed bottom-4 right-4 z-30">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button size="icon" className="h-12 w-12 rounded-full shadow-lg">
              <BookOpen className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80 sm:w-96 p-0">
            <GuidanceContent currentPhase={currentPhase} />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop: fixed sidebar */}
      <aside className="hidden lg:flex w-72 xl:w-80 bg-card border-l border-border flex-col shrink-0">
        <GuidanceContent currentPhase={currentPhase} />
      </aside>
    </>
  );
}
